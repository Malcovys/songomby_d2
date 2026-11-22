import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paginatedTicketsSchema, ticketSchema } from '@nexora/contracts';
import type { CreateTicket, Ticket, UpdateTicket } from '@nexora/contracts';
import { apiDelete, apiGet, apiSend } from '@/lib/api';

export interface TicketsParams {
  page: number;
  limit: number;
  status: Ticket['status'] | '';
  priority: Ticket['priority'] | '';
}

export function useTickets(params: TicketsParams) {
  const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.status) query.set('status', params.status);
  if (params.priority) query.set('priority', params.priority);

  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => apiGet(`/tickets?${query.toString()}`, paginatedTicketsSchema),
    placeholderData: keepPreviousData,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTicket) => apiSend('POST', '/tickets', input, ticketSchema),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: UpdateTicket }) =>
      apiSend('PATCH', `/tickets/${id}`, changes, ticketSchema),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/tickets/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });
}