import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { absenceSchema, paginatedAbsencesSchema } from '@nexora/contracts';
import type { CreateAbsence, UpdateAbsence } from '@nexora/contracts';
import { apiDelete, apiGet, apiSend } from '@/lib/api';

export interface AbsencesParams {
  page: number;
  limit: number;
  justified: 'true' | 'false' | '';
}

export function useAbsences(params: AbsencesParams) {
  const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.justified) query.set('justified', params.justified);

  return useQuery({
    queryKey: ['absences', params],
    queryFn: () => apiGet(`/absences?${query.toString()}`, paginatedAbsencesSchema),
    placeholderData: keepPreviousData,
  });
}

export function useCreateAbsence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAbsence) => apiSend('POST', '/absences', input, absenceSchema),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['absences'] }),
  });
}

export function useUpdateAbsence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: UpdateAbsence }) =>
      apiSend('PATCH', `/absences/${id}`, changes, absenceSchema),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['absences'] }),
  });
}

export function useDeleteAbsence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/absences/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['absences'] }),
  });
}