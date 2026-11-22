import { z } from 'zod';
import { paginatedSchema, paginationQuerySchema } from './api.ts';

export const createAbsenceSchema = z.object({
  employeeId: z.string().min(1),
  date: z.iso.date(),
  justified: z.boolean().default(false),
  reason: z.string().trim().max(500).optional(),
});

export type CreateAbsence = z.infer<typeof createAbsenceSchema>;

export const updateAbsenceSchema = z.object({
  justified: z.boolean().optional(),
  reason: z.string().trim().max(500).optional(),
});

export type UpdateAbsence = z.infer<typeof updateAbsenceSchema>;

export const listAbsencesQuerySchema = paginationQuerySchema.extend({
  employeeId: z.string().optional(),
  justified: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  from: z.iso.date().optional(),
  to: z.iso.date().optional(),
});

export type ListAbsencesQuery = z.infer<typeof listAbsencesQuerySchema>;

export const absenceSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  employee: z.object({
    id: z.string(),
    matricule: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  date: z.string(),
  justified: z.boolean(),
  reason: z.string().nullable(),
  createdAt: z.string(),
});

export type Absence = z.infer<typeof absenceSchema>;

export const paginatedAbsencesSchema = paginatedSchema(absenceSchema);

export type PaginatedAbsences = z.infer<typeof paginatedAbsencesSchema>;