import { AgentView } from '@/features/agent/agent-view';
import { EmployeesPage } from '@/features/employees/employees-page';
import { PagePlaceholder } from './page-placeholder';
import { Sidebar } from './sidebar';
import { TabBar } from './tab-bar';
import type { TabId } from './pages';
import { useWorkspace } from './workspace-store';
import { HolidaysPage } from '../holidays/holidays-page';

function PageView({ id }: { id: TabId }) {
  if (id === 'employees') return <EmployeesPage />;
  if (id === 'holidays') return <HolidaysPage />;
  return <PagePlaceholder id={id} />;
}

export function Workspace() {
  const { active } = useWorkspace();

  return (
    <div className="flex h-screen bg-paper text-ink">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TabBar />
        <main className="min-h-0 flex-1 overflow-hidden bg-panel">
          <div hidden={active !== 'agent'} className="h-full">
            <AgentView />
          </div>
          {active !== 'agent' && <PageView id={active} />}
        </main>
      </div>
    </div>
  );
}