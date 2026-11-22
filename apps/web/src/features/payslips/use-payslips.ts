import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paginatedPayslipsSchema, payslipPreviewSchema, payslipSchema } from '@nexora/contracts';
import type { PayslipInput } from '@nexora/contracts';
import { apiDelete, apiGet, apiSend } from '@/lib/api';

export interface PayslipsParams {
  page: number;
  limit: number;
  month: number | '';
  year: number | '';
}

export function usePayslips(params: PayslipsParams) {
  const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.month !== '') query.set('month', String(params.month));
  if (params.year !== '') query.set('year', String(params.year));

  return useQuery({
    queryKey: ['payslips', params],
    queryFn: () => apiGet(`/payslips?${query.toString()}`, paginatedPayslipsSchema),
    placeholderData: keepPreviousData,
  });
}

// Calcule sans rien enregistrer
export function usePreviewPayslip() {
  return useMutation({
    mutationFn: (input: PayslipInput) =>
      apiSend('POST', '/payslips/preview', input, payslipPreviewSchema),
  });
}

export function useGeneratePayslip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PayslipInput) => apiSend('POST', '/payslips', input, payslipSchema),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payslips'] }),
  });
}

export function useDeletePayslip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payslips/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payslips'] }),
  });
}