import type { Employee } from '@nexora/contracts';
import { cn } from '@/lib/utils';
import { STATUS_LABELS } from './format';

const DOT: Record<Employee['status'], string> = {
  ACTIVE: 'bg-accent',
  ON_LEAVE: 'bg-amber-600',
  TERMINATED: 'bg-ink-soft/50',
};

export function StatusBadge({ status }: { status: Employee['status'] }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn('size-2 rounded-full', DOT[status])} aria-hidden />
      {STATUS_LABELS[status]}
    </span>
  );
}