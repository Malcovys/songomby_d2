import { z } from 'zod';

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(8000),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(40),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const proposalStatusSchema = z.enum(['PREVIEW', 'APPLIED', 'FAILED', 'CANCELLED']);

export const proposalSchema = z.object({
  id: z.string(),
  tool: z.string(),
  summary: z.string(), // phrase montrée à l'utilisateur
  status: proposalStatusSchema,
  error: z.string().nullable(),
});

export type Proposal = z.infer<typeof proposalSchema>;

export const chatResponseSchema = z.object({
  reply: z.string(),
  proposals: z.array(proposalSchema),
});

export type ChatResponse = z.infer<typeof chatResponseSchema>;

export const proposalActionSchema = z.object({
  proposal: proposalSchema,
  message: z.string(),
});

export type ProposalAction = z.infer<typeof proposalActionSchema>;

export const chatStreamEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('status'), text: z.string() }),
  z.object({ type: z.literal('delta'), text: z.string() }),
  z.object({ type: z.literal('done'), reply: z.string(), proposals: z.array(proposalSchema) }),
  z.object({ type: z.literal('error'), message: z.string() }),
]);

export type ChatStreamEvent = z.infer<typeof chatStreamEventSchema>;