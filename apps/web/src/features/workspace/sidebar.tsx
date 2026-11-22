import { HealthBadge } from '@/features/health/health-badge';
import { cn } from '@/lib/utils';
import { AGENT_META, PAGES } from './pages';
import type { TabId, TabMeta } from './pages';
import { openTab, useWorkspace } from './workspace-store';

interface NavItemProps {
  id: TabId;
  meta: TabMeta;
  active: boolean;
  open: boolean;
}

function NavItem({ id, meta, active, open }: NavItemProps) {
  const Icon = meta.icon;
  return (
    <li>
      <button
        type="button"
        onClick={() => openTab(id)}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm',
          'focus-visible:outline-2 focus-visible:outline-accent',
          active ? 'bg-accent-soft font-medium text-accent' : 'text-ink hover:bg-line/60',
        )}
      >
        <Icon className="size-4 shrink-0" aria-hidden />
        <span className="flex-1 truncate">{meta.label}</span>
        {open && !active && <span className="size-1.5 rounded-full bg-accent/50" aria-hidden />}
      </button>
    </li>
  );
}

export function Sidebar() {
  const { tabs, active } = useWorkspace();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-paper md:flex">
      <div className="flex h-12 items-center px-4 text-base font-semibold tracking-tight">
        Nexora
      </div>

      <nav aria-label="Navigation" className="flex-1 overflow-y-auto px-2 py-1">
        <ul className="flex flex-col gap-0.5">
          <NavItem
            id="agent"
            meta={AGENT_META}
            active={active === 'agent'}
            open={tabs.includes('agent')}
          />
        </ul>
        <hr className="mx-2 my-2 border-line" />
        <ul className="flex flex-col gap-0.5">
          {PAGES.map((page) => (
            <NavItem
              key={page.id}
              id={page.id}
              meta={page}
              active={active === page.id}
              open={tabs.includes(page.id)}
            />
          ))}
        </ul>
      </nav>

      <div className="border-t border-line px-4 py-3">
        <HealthBadge />
      </div>
    </aside>
  );
}