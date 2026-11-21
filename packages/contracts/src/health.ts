import { z } from 'zod';

export const healthStatusSchema = z.enum(['ok', 'degraded']);

export const livenessSchema = z.object({
  status: z.literal('ok'),
});

export const readinessSchema = z.object({
  status: healthStatusSchema,
  checks: z.record(z.string(), healthStatusSchema),
});

export type Liveness = z.infer<typeof livenessSchema>;
export type Readiness = z.infer<typeof readinessSchema>;
