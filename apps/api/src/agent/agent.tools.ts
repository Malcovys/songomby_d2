import { Injectable } from '@nestjs/common';
import {
  EmployeesService,
  HolidaysService,
  LeavesService,
  PayslipsService,
  TicketsService,
} from '@nexora/core';
import { z } from 'zod';

export interface AgentTool {
  name: string;
  description: string;
  kind: 'read' | 'write';
  parameters: Record<string, unknown>;
  parse(raw: unknown): { ok: true; params: unknown } | { ok: false; error: string };
  run(params: unknown): Promise<unknown>;
  summarize(params: unknown): Promise<string>;
}

// Ce que Gemini n'accepte pas dans un schéma d'outil. La validation reste faite par Zod.
const HIDDEN_KEYS = new Set(['$schema', 'additionalProperties', 'pattern', 'format']);

function clean(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(clean);
  if (node && typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node)
        .filter(([key]) => !HIDDEN_KEYS.has(key))
        .map(([key, value]) => [key, clean(value)]),
    );
  }
  return node;
}

function defineTool<S extends z.ZodType>(def: {
  name: string;
  description: string;
  kind: 'read' | 'write';
  schema: S;
  run: (params: z.output<S>) => Promise<unknown>;
  summarize?: (params: z.output<S>) => Promise<string>;
}): AgentTool {
  return {
    name: def.name,
    description: def.description,
    kind: def.kind,
    parameters: clean(z.toJSONSchema(def.schema, { io: 'input' })) as Record<string, unknown>,
    parse(raw) {
      const result = def.schema.safeParse(raw);
      return result.success
        ? { ok: true, params: result.data }
        : { ok: false, error: z.prettifyError(result.error) };
    },
    run: (params) => def.run(params as z.output<S>),
    summarize: async (params) => (def.summarize ? def.summarize(params as z.output<S>) : def.name),
  };
}

const date = z.iso.date().describe('Date au format AAAA-MM-JJ');
const employeeId = z
  .string()
  .min(1)
  .describe("Identifiant de l'employé, obtenu avec find_employees");
const month = z.number().int().min(1).max(12).describe('Mois, de 1 à 12');
const year = z.number().int().min(2000).max(2100);
const leaveType = z.enum(['ANNUAL', 'SICK', 'UNPAID', 'MATERNITY', 'PATERNITY', 'OTHER']);

const LEAVE_LABELS = {
  ANNUAL: 'congé payé',
  SICK: 'arrêt maladie',
  UNPAID: 'congé sans solde',
  MATERNITY: 'congé maternité',
  PATERNITY: 'congé paternité',
  OTHER: 'congé (autre)',
} as const;

const payslipParams = z.object({
  employeeId,
  month,
  year,
  bonuses: z.number().min(0).optional().describe('Primes du mois, 0 par défaut'),
});

const createEmployeeParams = z.object({
  matricule: z.string().trim().min(1).max(30).describe('Matricule unique du nouvel employé'),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.email().optional(),
  phone: z.string().trim().max(30).optional(),
  position: z.string().trim().min(1).max(100).describe('Intitulé du poste'),
  department: z.string().trim().max(100).optional(),
  contractType: z.enum(['CDI', 'CDD', 'INTERN', 'FREELANCE']).default('CDI'),
  status: z.enum(['ACTIVE', 'ON_LEAVE', 'TERMINATED']).default('ACTIVE'),
  hireDate: date.describe("Date d'embauche"),
  endDate: date.optional(),
  baseSalary: z.number().positive().describe('Salaire de base'),
  leaveBalanceDays: z.number().min(0).max(999).default(30),
});

const money = (value: string, currency: string): string =>
  `${Number(value).toLocaleString('fr-FR')} ${currency}`;

@Injectable()
export class AgentTools {
  private readonly tools: AgentTool[];

  constructor(
    employees: EmployeesService,
    holidays: HolidaysService,
    leaves: LeavesService,
    payslips: PayslipsService,
    tickets: TicketsService,
  ) {
    const fullName = async (id: string): Promise<string> => {
      const employee = await employees.get(id);
      return `${employee.firstName} ${employee.lastName} (${employee.matricule})`;
    };
    const payslipInput = (p: z.output<typeof payslipParams>) => ({
      employeeId: p.employeeId,
      month: p.month,
      year: p.year,
      bonuses: p.bonuses ?? 0,
    });

    this.tools = [
      // ---------- Lecture : exécutés tout de suite ----------
      defineTool({
        name: 'find_employees',
        description: 'Cherche des employés (nom, prénom, matricule ou email) et renvoie leur id.',
        kind: 'read',
        schema: z.object({
          search: z.string().optional(),
          department: z.string().optional(),
          status: z.enum(['ACTIVE', 'ON_LEAVE', 'TERMINATED']).optional(),
        }),
        run: async (p) => {
          const result = await employees.list({ page: 1, limit: 20, ...p });
          return {
            total: result.total,
            employees: result.items.map((e) => ({
              id: e.id,
              matricule: e.matricule,
              name: `${e.firstName} ${e.lastName}`,
              position: e.position,
              department: e.department,
              status: e.status,
              leaveBalanceDays: e.leaveBalanceDays,
            })),
          };
        },
      }),

      defineTool({
        name: 'list_leaves',
        description: 'Liste les congés, avec filtres facultatifs.',
        kind: 'read',
        schema: z.object({
          employeeId: employeeId.optional(),
          type: leaveType.optional(),
          status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']).optional(),
          from: date.optional(),
          to: date.optional(),
        }),
        run: async (p) => {
          const result = await leaves.list({ page: 1, limit: 20, ...p });
          return {
            total: result.total,
            leaves: result.items.map((l) => ({
              id: l.id,
              employee: `${l.employee.firstName} ${l.employee.lastName}`,
              type: l.type,
              status: l.status,
              startDate: l.startDate,
              endDate: l.endDate,
              days: l.days,
            })),
          };
        },
      }),

      defineTool({
        name: 'list_tickets',
        description:
          'Liste les tickets, éventuellement filtrés par statut. Renvoie au maximum 20 tickets.',
        kind: 'read',
        schema: z.object({
          status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE', 'CLOSED']).optional(),
        }),
        run: async (p) => {
          const result = await tickets.list({ page: 1, limit: 20, ...p });
          return {
            total: result.total,
            tickets: result.items.map((ticket) => ({
              title: ticket.title,
              description: ticket.description,
              status: ticket.status,
              priority: ticket.priority,
              employee: ticket.employee
                ? `${ticket.employee.firstName} ${ticket.employee.lastName}`
                : null,
            })),
          };
        },
      }),

      defineTool({
        name: 'list_holidays',
        description: 'Liste les jours fériés enregistrés, éventuellement pour une année.',
        kind: 'read',
        schema: z.object({ year: year.optional() }),
        run: async (p) => {
          const items = await holidays.list({ year: p.year });
          return items.map((h) => ({ date: h.date, name: h.name }));
        },
      }),

      defineTool({
        name: 'preview_payslip',
        description: 'Calcule une fiche de paie sans l’enregistrer.',
        kind: 'read',
        schema: payslipParams,
        run: (p) => payslips.preview(payslipInput(p)),
      }),

      // ---------- Écriture : l'utilisateur doit valider ----------
      defineTool({
        name: 'add_holidays',
        description: 'Ajoute un ou plusieurs jours fériés.',
        kind: 'write',
        schema: z.object({
          items: z
            .array(z.object({ date, name: z.string().min(1).max(150) }))
            .min(1)
            .max(100),
        }),
        run: (p) => holidays.createMany({ items: p.items }),
        summarize: async (p) =>
          `Ajouter ${p.items.length} jour(s) férié(s) : ${p.items
            .map((item) => `${item.date} (${item.name})`)
            .join(', ')}`,
      }),

      defineTool({
        name: 'create_leave',
        description: 'Crée une demande de congé pour un employé.',
        kind: 'write',
        schema: z.object({
          employeeId,
          type: leaveType,
          startDate: date,
          endDate: date,
          reason: z.string().max(500).optional(),
        }),
        run: (p) => leaves.create(p),
        summarize: async (p) =>
          `Créer un ${LEAVE_LABELS[p.type]} pour ${await fullName(p.employeeId)} du ${p.startDate} au ${p.endDate}`,
      }),

      defineTool({
        name: 'create_ticket',
        description: 'Crée un ticket (demande ou tâche interne).',
        kind: 'write',
        schema: z.object({
          title: z.string().min(1).max(200),
          description: z.string().max(5000).optional(),
          priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
          employeeId: employeeId.optional(),
        }),
        run: (p) => tickets.create({ ...p, priority: p.priority ?? 'MEDIUM' }),
        summarize: async (p) => {
          const who = p.employeeId ? ` concernant ${await fullName(p.employeeId)}` : '';
          return `Créer le ticket « ${p.title} »${who} (priorité ${p.priority ?? 'MEDIUM'})`;
        },
      }),

      defineTool({
        name: 'create_employee',
        description:
          "Prépare la création d'un employé. Demande les champs obligatoires manquants et n'invente aucune donnée.",
        kind: 'write',
        schema: createEmployeeParams,
        run: (p) => employees.create(p),
        summarize: async (p) =>
          `Créer la fiche de ${p.firstName} ${p.lastName} (matricule ${p.matricule}), ` +
          `poste ${p.position}, département ${p.department ?? 'non précisé'}, contrat ${p.contractType}, ` +
          `embauche le ${p.hireDate}, salaire de base ${p.baseSalary}`,
      }),

      defineTool({
        name: 'generate_payslip',
        description: 'Génère et enregistre la fiche de paie d’un employé pour un mois.',
        kind: 'write',
        schema: payslipParams,
        run: (p) => payslips.generate(payslipInput(p)),
        summarize: async (p) => {
          const [name, preview] = await Promise.all([
            fullName(p.employeeId),
            payslips.preview(payslipInput(p)),
          ]);
          const c = preview.currency;
          return (
            `Générer la fiche de paie ${String(p.month).padStart(2, '0')}/${p.year} de ${name} : ` +
            `base ${money(preview.baseSalary, c)}, retenues ${money(preview.deductions, c)}, ` +
            `primes ${money(preview.bonuses, c)}, net ${money(preview.netSalary, c)}`
          );
        },
      }),
    ];
  }

  get all(): AgentTool[] {
    return this.tools;
  }

  get(name: string): AgentTool | undefined {
    return this.tools.find((tool) => tool.name === name);
  }
}