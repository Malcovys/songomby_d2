import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTabMeta } from './pages';
import { activateTab, closeTab, useWorkspace } from './workspace-store';

export function TabBar() {
  const { tabs, active } = useWorkspace();

  return (
    <div
      role="tablist"
      aria-label="Pages ouvertes"
      className="flex h-11 shrink-0 items-end gap-1 overflow-x-auto border-b border-line bg-paper px-2"
    >
      {tabs.map((id) => {
        const meta = getTabMeta(id);
        const Icon = meta.icon;
        const selected = id === active;

        return (
          <div
            key={id}
            className={cn(
              'relative flex h-9 shrink-0 items-center rounded-t-md border border-b-0',
              selected
                ? '-mb-px border-line bg-panel text-ink'
                : 'border-transparent text-ink-soft hover:text-ink',
            )}
          >
            <button
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => activateTab(id)}
              className={cn(
                'flex h-full items-center gap-2 pl-3 text-sm focus-visible:outline-2 focus-visible:outline-accent',
                id === 'agent' ? 'pr-3' : 'pr-1',
              )}
            >
              <Icon className="size-4" aria-hidden />
              {meta.label}
            </button>
            {id !== 'agent' && (
              <button
                type="button"
                aria-label={`Fermer ${meta.label}`}
                onClick={() => closeTab(id)}
                className="mr-1.5 rounded p-1 text-ink-soft hover:bg-line focus-visible:outline-2 focus-visible:outline-accent"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}