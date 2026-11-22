import { z } from 'zod';
import { paginatedSchema, paginationQuerySchema } from './api.ts';

// Doivent rester identiques aux enums de prisma/schema.prisma
export const leaveTypeSchema = z.enum([
  'ANNUAL',
  'SICK',
  'UNPAID',
  'MATERNITY',
  'PATERNITY',
  'OTHER',
]);
export const leaveStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']);

// ---------- Création : les jours sont calculés par le serveur ----------

export const createLeaveSchema = z.object({
  employeeId: z.string().min(1),
  type: leaveTypeSchema,
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  reason: z.string().trim().max(500).optional(),
  certificateRef: z.string().trim().max(100).optional(), // arrêt maladie
});

export type CreateLeave = z.infer<typeof createLeaveSchema>;

// ---------- Changement de statut ----------

export const updateLeaveStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'CANCELLED']),
});

export type UpdateLeaveStatus = z.infer<typeof updateLeaveStatusSchema>;

// ---------- Liste ----------

export const listLeavesQuerySchema = paginationQuerySchema.extend({
  employeeId: z.string().optional(),
  type: leaveTypeSchema.optional(),
  status: leaveStatusSchema.optional(),
  from: z.iso.date().optional(), // congés qui touchent la période from -> to
  to: z.iso.date().optional(),
});

export type ListLeavesQuery = z.infer<typeof listLeavesQuerySchema>;

// ---------- Réponse ----------

export const leaveSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  employee: z.object({
    id: z.string(),
    matricule: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  type: leaveTypeSchema,
  status: leaveStatusSchema,
  startDate: z.string(),
  endDate: z.string(),
  days: z.string(),
  reason: z.string().nullable(),
  certificateRef: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Leave = z.infer<typeof leaveSchema>;

export const paginatedLeavesSchema = paginatedSchema(leaveSchema);

export type PaginatedLeaves = z.infer<typeof paginatedLeavesSchema>;