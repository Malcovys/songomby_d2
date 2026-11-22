import { BadGatewayException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { loadEnv } from '@nexora/core';

export interface ToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

// Message brut du modèle. On le renvoie tel quel dans l'historique :
// Gemini 3 y glisse des signatures de réflexion qu'il réclame au tour suivant.
export type LlmMessage = Record<string, unknown>;

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 3;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

function failure(status: number, detail: string): BadGatewayException {
  if (status === 0) {
    return new BadGatewayException({
      code: 'llm_unreachable',
      message: 'Impossible de joindre Gemini (réseau ou délai dépassé). Vérifiez votre connexion.',
    });
  }
  if (status === 429) {
    return new BadGatewayException({
      code: 'llm_rate_limited',
      message: 'Limite gratuite de Gemini atteinte. Réessayez dans une minute.',
    });
  }
  if (status === 503) {
    return new BadGatewayException({
      code: 'llm_overloaded',
      message:
        'Gemini est surchargé en ce moment. Réessayez dans un instant ou changez LLM_MODEL dans le .env.',
    });
  }
  return new BadGatewayException({
    code: 'llm_error',
    message: `Le modèle a répondu ${status}. ${detail.slice(0, 300)}`,
  });
}

interface StreamOptions {
  onDelta: (text: string) => void;
  signal?: AbortSignal;
}

interface RawToolCall {
  id?: string;
  function?: { name?: string; arguments?: string };
  [key: string]: unknown;
}

const emptyResponse = (): BadGatewayException =>
  new BadGatewayException({ code: 'llm_empty', message: 'Réponse vide du modèle.' });

@Injectable()
export class LlmClient {
  async chat(
    messages: LlmMessage[],
    tools: ToolDefinition[],
    signal?: AbortSignal,
  ): Promise<LlmMessage> {
    const response = await this.open(messages, tools, false, signal);
    const data = (await response.json()) as { choices?: { message?: LlmMessage }[] };
    const message = data.choices?.[0]?.message;
    if (!message) throw emptyResponse();
    return message;
  }

  // Même résultat que chat(), mais le texte est transmis au fil de l'eau avec onDelta
  async stream(
    messages: LlmMessage[],
    tools: ToolDefinition[],
    { onDelta, signal }: StreamOptions,
  ): Promise<LlmMessage> {
    const response = await this.open(messages, tools, true, signal);
    if (!response.body) throw emptyResponse();

    let content = '';
    const calls: ToolCall[] = [];
    const extras: Record<string, unknown> = {}; // signatures de réflexion de Gemini 3, etc.

    // Gemini envoie les appels d'outils entiers, d'autres API les envoient en morceaux :
    // un morceau avec un nom démarre un appel, les suivants complètent ses arguments.
    const addCall = (raw: RawToolCall): void => {
      const last = calls[calls.length - 1];
      if (raw.function?.name || !last) {
        const call: ToolCall & Record<string, unknown> = {
          ...raw,
          id: raw.id || `call_${calls.length + 1}`,
          type: 'function',
          function: { name: raw.function?.name ?? '', arguments: raw.function?.arguments ?? '' },
        };
        delete call['index'];
        calls.push(call);
      } else {
        last.function.arguments += raw.function?.arguments ?? '';
      }
    };

    const handle = (line: string): void => {
      if (!line.startsWith('data:')) return;
      const payload = line.slice(5).trim();
      if (payload === '' || payload === '[DONE]') return;

      let chunk: { choices?: { delta?: Record<string, unknown> }[] };
      try {
        chunk = JSON.parse(payload) as typeof chunk;
      } catch {
        return;
      }

      const delta = chunk.choices?.[0]?.delta;
      if (!delta) return;
      for (const [key, value] of Object.entries(delta)) {
        if (key === 'content') {
          if (typeof value === 'string' && value !== '') {
            content += value;
            onDelta(value);
          }
        } else if (key === 'tool_calls') {
          if (Array.isArray(value)) (value as RawToolCall[]).forEach(addCall);
        } else if (key !== 'role') {
          extras[key] = value;
        }
      }
    };

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        lines.forEach((line) => handle(line.trim()));
      }
      handle(buffer.trim());
    } catch (error) {
      if (signal?.aborted) throw error;
      throw new BadGatewayException({
        code: 'llm_interrupted',
        message: 'La réponse du modèle a été interrompue. Réessayez.',
      });
    }

    if (content === '' && calls.length === 0) throw emptyResponse();
    return {
      role: 'assistant',
      content: content === '' ? null : content,
      ...extras,
      ...(calls.length > 0 && { tool_calls: calls }),
    };
  }

  // Envoie la requête (avec nouvelles tentatives) et renvoie la réponse HTTP
  private async open(
    messages: LlmMessage[],
    tools: ToolDefinition[],
    stream: boolean,
    signal?: AbortSignal,
  ): Promise<Response> {
    const env = loadEnv();
    if (!env.LLM_API_KEY || !env.LLM_MODEL) {
      throw new ServiceUnavailableException({
        code: 'llm_not_configured',
        message: 'Renseignez LLM_API_KEY et LLM_MODEL dans le fichier .env, puis relancez l’API.',
      });
    }

    const url = `${env.LLM_BASE_URL.replace(/\/$/, '')}/chat/completions`;
    const body = JSON.stringify({
      model: env.LLM_MODEL,
      reasoning_effort: 'low',
      messages,
      tools: tools.map((tool) => ({ type: 'function', function: tool })),
      tool_choice: 'auto',
      ...(stream && { stream: true }),
    });

    let status = 0;
    let detail = '';

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const timeout = AbortSignal.timeout(60_000);
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${env.LLM_API_KEY}`,
          },
          body,
          signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
        });

        if (response.ok) return response;

        status = response.status;
        detail = await response.text().catch(() => '');
        if (!RETRYABLE_STATUS.has(status)) break;
      } catch (error) {
        if (signal?.aborted) throw error;
        status = 0; // réseau coupé ou délai dépassé
        detail = '';
      }

      if (attempt < MAX_ATTEMPTS) await sleep(2000 * attempt);
    }

    throw failure(status, detail);
  }
}