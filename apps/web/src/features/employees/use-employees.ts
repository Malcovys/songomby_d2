import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { paginatedEmployeesSchema } from '@nexora/contracts';
import type { Employee } from '@nexora/contracts';
import { apiGet } from '@/lib/api';

export interface EmployeesParams {
  page: number;
  limit: number;
  search: string;
  status: Employee['status'] | '';
}

export function useEmployees(params: EmployeesParams) {
  const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);

  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => apiGet(`/employees?${query.toString()}`, paginatedEmployeesSchema),
    placeholderData: keepPreviousData, // garde l'ancienne liste affichée pendant le chargement
  });
}