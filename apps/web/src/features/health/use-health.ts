import { livenessSchema } from '@nexora/contracts';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';

export function useHealth() {
  return useQuery({
    queryKey: ['health', 'live'],
    queryFn: () => apiGet('/health/live', livenessSchema),
    refetchInterval: 30_000,
  });
}
