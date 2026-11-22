import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, limit, total, onChange }: PaginationProps) {
  if (total === 0) return null;

  const pageCount = Math.max(1, Math.ceil(total / limit));
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <footer className="flex items-center justify-between border-t border-line px-6 py-2.5 text-sm text-ink-soft">
      <span>
        {from}–{to} sur {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Page précédente"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="rounded p-1.5 hover:bg-paper disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-accent"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <span className="px-1 tabular-nums">
          {page} / {pageCount}
        </span>
        <button
          type="button"
          aria-label="Page suivante"
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
          className="rounded p-1.5 hover:bg-paper disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-accent"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </footer>
  );
}