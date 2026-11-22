import { getTabMeta } from './pages';
import type { TabId } from './pages';

export function PagePlaceholder({ id }: { id: TabId }) {
  const meta = getTabMeta(id);

  return (
    <div className="flex flex-col gap-2 p-8">
      <h1 className="text-xl font-semibold tracking-tight">{meta.label}</h1>
      <p className="max-w-md text-sm text-ink-soft">{meta.description}</p>
      <p className="max-w-md text-sm text-ink-soft">Cette page est en cours de construction.</p>
    </div>
  );
}