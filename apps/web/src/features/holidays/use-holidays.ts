import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { holidaySchema } from '@nexora/contracts';
import type { CreateHoliday } from '@nexora/contracts';
import { z } from 'zod';
import { apiDelete, apiGet, apiSend } from '@/lib/api';

const holidaysSchema = z.array(holidaySchema);

export function useHolidays(year: number) {
  return useQuery({
    queryKey: ['holidays', year],
    queryFn: () => apiGet(`/holidays?year=${year}`, holidaysSchema),
  });
}

export function useCreateHoliday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateHoliday) => apiSend('POST', '/holidays', input, holidaySchema),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['holidays'] }),
  });
}

export function useDeleteHoliday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/holidays/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['holidays'] }),
  });
}