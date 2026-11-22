import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatResponseSchema, proposalActionSchema } from '@nexora/contracts';
import type { ChatRequest } from '@nexora/contracts';
import { apiSend } from '@/lib/api';

export function useChat() {
  return useMutation({
    mutationFn: (input: ChatRequest) => apiSend('POST', '/agent/chat', input, chatResponseSchema),
  });
}

const DATA_KEYS = ['employees', 'leaves', 'holidays', 'tickets', 'payslips', 'absences'];

export function useProposalAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'apply' | 'cancel' }) =>
      apiSend('POST', `/agent/proposals/${id}/${action}`, {}, proposalActionSchema),
    // les pages ouvertes se rafraîchissent après une action
    onSuccess: () =>
      Promise.all(DATA_KEYS.map((key) => queryClient.invalidateQueries({ queryKey: [key] }))),
  });
}