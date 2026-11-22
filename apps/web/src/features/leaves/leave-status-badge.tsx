import type { Leave } from '@nexora/contracts';
import { cn } from '@/lib/utils';
import { STATUS_LABELS } from './format';

const DOT: Record<Leave['status'], string> = {
  PENDING: 'bg-amber-600',
  APPROVED: 'bg-accent',
  REJECTED: 'bg-red-700',
  CANCELLED: 'bg-ink-soft/50',
};

export function LeaveStatusBadge({ status }: { status: Leave['status'] }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn('size-2 rounded-full', DOT[status])} aria-hidden />
      {STATUS_LABELS[status]}
    </span>
  );
}