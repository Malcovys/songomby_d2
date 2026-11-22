import { z } from 'zod';
import { paginatedSchema, paginationQuerySchema } from './api.ts';

// Doivent rester identiques aux enums de prisma/schema.prisma
export const ticketStatusSchema = z.enum(['OPEN', 'IN_PROGRESS', 'DONE', 'CLOSED']);
export const ticketPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const createTicketSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional(),
  priority: ticketPrioritySchema.default('MEDIUM'),
  employeeId: z.string().min(1).optional(),
});

export type CreateTicket = z.infer<typeof createTicketSchema>;

// Pas de valeurs par défaut ici : un champ absent n'est pas modifié
export const updateTicketSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(5000).nullable().optional(),
  status: ticketStatusSchema.optional(),
  priority: ticketPrioritySchema.optional(),
  employeeId: z.string().min(1).nullable().optional(), // null = détacher
});

export type UpdateTicket = z.infer<typeof updateTicketSchema>;

export const listTicketsQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(), // titre ou description
  status: ticketStatusSchema.optional(),
  priority: ticketPrioritySchema.optional(),
  employeeId: z.string().optional(),
});

export type ListTicketsQuery = z.infer<typeof listTicketsQuerySchema>;

export const ticketSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  status: ticketStatusSchema,
  priority: ticketPrioritySchema,
  employeeId: z.string().nullable(),
  employee: z
    .object({
      id: z.string(),
      matricule: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    })
    .nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Ticket = z.infer<typeof ticketSchema>;

export const paginatedTicketsSchema = paginatedSchema(ticketSchema);

export type PaginatedTickets = z.infer<typeof paginatedTicketsSchema>;