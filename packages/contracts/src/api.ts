import { z } from 'zod';

export const API_PREFIX = 'api/v1';

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
  requestId: z.string(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  sort: z.string().optional(),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const paginatedSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    items: z.array(item),
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
  });
