import { cn } from '@/lib/utils';
import { useHealth } from './use-health';

export function HealthBadge() {
  const { data, isPending } = useHealth();
  const label = isPending ? 'Checking' : data ? 'API online' : 'API offline';

  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-600">
      <span
        className={cn(
          'size-2 rounded-full',
          isPending ? 'bg-slate-400' : data ? 'bg-emerald-500' : 'bg-red-500',
        )}
      />
      {label}
    </span>
  );
}
