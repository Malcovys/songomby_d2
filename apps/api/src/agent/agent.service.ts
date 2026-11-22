import { ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import type { ChatRequest, ChatResponse, Proposal, ProposalAction, ChatStreamEvent } from '@nexora/contracts';
import { PrismaService } from '@nexora/core';
import { AgentTools } from './agent.tools.ts';
import { LlmClient } from './llm.client.ts';
import type { LlmMessage, ToolCall } from './llm.client.ts';


const MAX_STEPS = 6;

export interface ChatHooks {
  onDelta?: (text: string) => void;
  onTool?: (name: string) => void;
  signal?: AbortSignal;
}

const TOOL_STATUS: Record<string, string> = {
  find_employees: 'Recherche des employés…',
  list_leaves: 'Consultation des congés…',
  list_holidays: 'Consultation des jours fériés…',
  preview_payslip: 'Calcul de la fiche de paie…',
  add_holidays: 'Préparation des jours fériés…',
  create_leave: 'Préparation du congé…',
  create_ticket: 'Préparation du ticket…',
  generate_payslip: 'Préparation de la fiche de paie…',
};

const systemPrompt = (): string => `Tu es l'assistant de NEXORA, un ERP de gestion RH pour une seule entreprise.
Tu réponds en français, de façon brève.
Règles :
- N'invente jamais d'identifiant. Pour toute action sur un employé, appelle d'abord find_employees et utilise l'id renvoyé. S'il y a plusieurs correspondances, demande laquelle.
- Les outils add_holidays, create_leave, create_ticket et generate_payslip ne modifient rien tout de suite : ils créent une proposition que l'utilisateur valide avec un bouton. Après en avoir créé une, dis simplement qu'elle est prête à être validée.
- Ne calcule jamais un salaire toi-même : utilise preview_payslip ou generate_payslip.
- S'il manque une information (employé, date, mois), demande-la.
- Formate en Markdown simple (listes courtes, gras pour les libellés).
- N'affiche jamais les identifiants techniques (id) à l'utilisateur.
- Écris les noms sous la forme « Prénom Nom ».
- La date du jour est ${new Date().toISOString().slice(0, 10)}.`;

const toJson = (value: unknown) => JSON.parse(JSON.stringify(value ?? {}));

function errorMessage(error: unknown): string {
  if (error instanceof HttpException) {
    const body = error.getResponse();
    if (typeof body === 'object' && body !== null && 'message' in body) {
      return String((body as { message: unknown }).message);
    }
  }
  return error instanceof Error ? error.message : 'Erreur inconnue';
}

function toProposal(row: {
  id: string;
  tool: string;
  params: unknown;
  status: string;
  error: string | null;
}): Proposal {
  const params = row.params as { summary?: string };
  return {
    id: row.id,
    tool: row.tool,
    summary: params.summary ?? row.tool,
    status: row.status as Proposal['status'],
    error: row.error,
  };
}

@Injectable()
export class AgentService {
  constructor(
    private readonly llm: LlmClient,
    private readonly tools: AgentTools,
    private readonly prisma: PrismaService,
  ) {}

  async chat(request: ChatRequest, hooks: ChatHooks = {}): Promise<ChatResponse> {
    const messages: LlmMessage[] = [
      { role: 'system', content: systemPrompt() },
      ...request.messages.map((m) => ({ role: m.role, content: m.content })),
    ];
    const definitions = this.tools.all.map(({ name, description, parameters }) => ({
      name,
      description,
      parameters,
    }));
    const proposals: Proposal[] = [];
    const { onDelta, onTool, signal } = hooks;

    for (let step = 0; step < MAX_STEPS; step++) {
      const message = onDelta
        ? await this.llm.stream(messages, definitions, { onDelta, signal })
        : await this.llm.chat(messages, definitions, signal);
      messages.push(message);

      const calls = (message['tool_calls'] as ToolCall[] | undefined) ?? [];
      if (calls.length === 0) {
        const content = message['content'];
        return {
          reply: typeof content === 'string' && content !== '' ? content : 'Je n’ai pas de réponse.',
          proposals,
        };
      }

      for (const call of calls) {
        onTool?.(call.function.name);
        const output = await this.runCall(call, proposals);
        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          name: call.function.name,
          content: JSON.stringify(output),
        });
      }
    }

    return {
      reply: 'Je n’arrive pas à terminer cette demande. Essayez de la reformuler plus simplement.',
      proposals,
    };
  }

  async chatStream(
    request: ChatRequest,
    send: (event: ChatStreamEvent) => void,
    signal: AbortSignal,
  ): Promise<void> {
    try {
      const result = await this.chat(request, {
        signal,
        onDelta: (text) => send({ type: 'delta', text }),
        onTool: (name) => send({ type: 'status', text: TOOL_STATUS[name] ?? 'Traitement…' }),
      });
      send({ type: 'done', ...result });
    } catch (error) {
      if (!signal.aborted) send({ type: 'error', message: errorMessage(error) });
    }
  }

  private async runCall(call: ToolCall, proposals: Proposal[]): Promise<unknown> {
    const tool = this.tools.get(call.function.name);
    if (!tool) return { error: `Outil inconnu : ${call.function.name}` };

    let raw: unknown;
    try {
      raw = JSON.parse(call.function.arguments || '{}');
    } catch {
      return { error: 'Arguments illisibles' };
    }

    const parsed = tool.parse(raw);
    if (!parsed.ok) return { error: parsed.error };

    try {
      if (tool.kind === 'read') return await tool.run(parsed.params);

      const summary = await tool.summarize(parsed.params);
      const row = await this.prisma.auditLog.create({
        data: {
          tool: tool.name,
          params: toJson({ summary, input: parsed.params }),
          status: 'PREVIEW',
        },
      });
      proposals.push(toProposal(row));
      return {
        status: 'proposition_creee',
        message: 'Proposition prête, en attente de validation par l’utilisateur.',
        summary,
      };
    } catch (error) {
      return { error: errorMessage(error) };
    }
  }

  async apply(id: string): Promise<ProposalAction> {
    const row = await this.prisma.auditLog.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException({ code: 'proposal_not_found', message: 'Proposition introuvable' });
    }

    const tool = this.tools.get(row.tool);
    const parsed = tool?.parse((row.params as { input?: unknown }).input);
    if (!tool || tool.kind !== 'write' || !parsed?.ok) {
      throw new ConflictException({ code: 'proposal_invalid', message: 'Proposition invalide' });
    }

    // Réservation atomique : un double clic ne l'applique qu'une fois
    const claimed = await this.prisma.auditLog.updateMany({
      where: { id, status: 'PREVIEW' },
      data: { status: 'APPLIED' },
    });
    if (claimed.count === 0) {
      throw new ConflictException({
        code: 'proposal_not_pending',
        message: 'Cette proposition a déjà été traitée',
      });
    }

    try {
      const result = await tool.run(parsed.params);
      const updated = await this.prisma.auditLog.update({
        where: { id },
        data: { result: toJson(result) },
      });
      return { proposal: toProposal(updated), message: 'Action effectuée.' };
    } catch (error) {
      const message = errorMessage(error);
      const failed = await this.prisma.auditLog.update({
        where: { id },
        data: { status: 'FAILED', error: message },
      });
      return { proposal: toProposal(failed), message };
    }
  }

  async cancel(id: string): Promise<ProposalAction> {
    const claimed = await this.prisma.auditLog.updateMany({
      where: { id, status: 'PREVIEW' },
      data: { status: 'CANCELLED' },
    });
    if (claimed.count === 0) {
      throw new ConflictException({
        code: 'proposal_not_pending',
        message: 'Cette proposition a déjà été traitée',
      });
    }
    const row = await this.prisma.auditLog.findUniqueOrThrow({ where: { id } });
    return { proposal: toProposal(row), message: 'Proposition annulée.' };
  }
}