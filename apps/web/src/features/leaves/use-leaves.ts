import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { leaveSchema, paginatedLeavesSchema } from '@nexora/contracts';
import type { CreateLeave, Leave } from '@nexora/contracts';
import { apiGet, apiSend } from '@/lib/api';

export interface LeavesParams {
  page: number;
  limit: number;
  status: Leave['status'] | '';
  type: Leave['type'] | '';
}

export function useLeaves(params: LeavesParams) {
  const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.status) query.set('status', params.status);
  if (params.type) query.set('type', params.type);

  return useQuery({
    queryKey: ['leaves', params],
    queryFn: () => apiGet(`/leaves?${query.toString()}`, paginatedLeavesSchema),
    placeholderData: keepPreviousData,
  });
}

export function useCreateLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLeave) => apiSend('POST', '/leaves', input, leaveSchema),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leaves'] }),
  });
}

export function useUpdateLeaveStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'APPROVED' | 'REJECTED' | 'CANCELLED' }) =>
      apiSend('PATCH', `/leaves/${id}/status`, { status }, leaveSchema),
    onSuccess: () =>
      // le solde de congés de l'employé peut avoir changé
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['leaves'] }),
        queryClient.invalidateQueries({ queryKey: ['employees'] }),
      ]),
  });
}