import { z } from 'zod';
import { paginatedSchema, paginationQuerySchema } from './api.ts';

export const payslipStatusSchema = z.enum(['DRAFT', 'GENERATED']);

// ---------- Aperçu / génération ----------

export const payslipInputSchema = z.object({
  employeeId: z.string().min(1),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
  bonuses: z.coerce.number().min(0).default(0),
});

export type PayslipInput = z.infer<typeof payslipInputSchema>;

// ---------- Liste ----------

export const listPayslipsQuerySchema = paginationQuerySchema.extend({
  employeeId: z.string().optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
});

export type ListPayslipsQuery = z.infer<typeof listPayslipsQuerySchema>;

// ---------- Réponses ----------

const employeeSummarySchema = z.object({
  id: z.string(),
  matricule: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export const payslipPreviewSchema = z.object({
  employee: employeeSummarySchema,
  month: z.number().int(),
  year: z.number().int(),
  workingDays: z.number().int(),
  unpaidLeaveDays: z.number(),
  unjustifiedAbsences: z.number().int(),
  dailyRate: z.string(),
  baseSalary: z.string(),
  deductions: z.string(),
  bonuses: z.string(),
  netSalary: z.string(),
  currency: z.string(),
});

export type PayslipPreview = z.infer<typeof payslipPreviewSchema>;

export const payslipSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  employee: employeeSummarySchema,
  month: z.number().int(),
  year: z.number().int(),
  baseSalary: z.string(),
  deductions: z.string(),
  bonuses: z.string(),
  netSalary: z.string(),
  currency: z.string(),
  status: payslipStatusSchema,
  pdfUrl: z.string().nullable(),
  generatedAt: z.string().nullable(),
  createdAt: z.string(),
});

export type Payslip = z.infer<typeof payslipSchema>;

export const paginatedPayslipsSchema = paginatedSchema(payslipSchema);

export type PaginatedPayslips = z.infer<typeof paginatedPayslipsSchema>;