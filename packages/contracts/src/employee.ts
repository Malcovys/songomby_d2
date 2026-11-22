import { z } from 'zod';
import { paginatedSchema, paginationQuerySchema } from './api.ts';

// Doivent rester identiques aux enums de prisma/schema.prisma
export const employeeStatusSchema = z.enum(['ACTIVE', 'ON_LEAVE', 'TERMINATED']);
export const contractTypeSchema = z.enum(['CDI', 'CDD', 'INTERN', 'FREELANCE']);

// ---------- Création ----------

export const createEmployeeSchema = z.object({
  matricule: z.string().trim().min(1).max(30),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.email().optional(),
  phone: z.string().trim().max(30).optional(),
  position: z.string().trim().min(1).max(100),
  department: z.string().trim().max(100).optional(),
  contractType: contractTypeSchema.default('CDI'),
  status: employeeStatusSchema.default('ACTIVE'),
  hireDate: z.iso.date(), // "2026-01-15"
  endDate: z.iso.date().optional(),
  baseSalary: z.coerce.number().positive(),
  leaveBalanceDays: z.coerce.number().min(0).max(999).default(30),
});

export type CreateEmployee = z.infer<typeof createEmployeeSchema>;

// ---------- Modification (tous les champs deviennent optionnels) ----------

export const updateEmployeeSchema = createEmployeeSchema.partial();

export type UpdateEmployee = z.infer<typeof updateEmployeeSchema>;

// ---------- Liste : pagination + filtres ----------

export const listEmployeesQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(), // nom, prénom, matricule ou email
  department: z.string().trim().optional(),
  status: employeeStatusSchema.optional(),
  contractType: contractTypeSchema.optional(),
});

export type ListEmployeesQuery = z.infer<typeof listEmployeesQuerySchema>;

// ---------- Réponse de l'API ----------
// Les dates sortent en texte ISO et les montants (Decimal) en texte.

export const employeeSchema = z.object({
  id: z.string(),
  matricule: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  position: z.string(),
  department: z.string().nullable(),
  contractType: contractTypeSchema,
  status: employeeStatusSchema,
  hireDate: z.string(),
  endDate: z.string().nullable(),
  baseSalary: z.string(),
  leaveBalanceDays: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Employee = z.infer<typeof employeeSchema>;

export const paginatedEmployeesSchema = paginatedSchema(employeeSchema);

export type PaginatedEmployees = z.infer<typeof paginatedEmployeesSchema>;