import { AgentView } from '@/features/agent/agent-view';
import { EmployeesPage } from '@/features/employees/employees-page';
import { PagePlaceholder } from './page-placeholder';
import { Sidebar } from './sidebar';
import { TabBar } from './tab-bar';
import type { TabId } from './pages';
import { useWorkspace } from './workspace-store';
import { HolidaysPage } from '../holidays/holidays-page';
import { LeavesPage } from '../leaves/leaves-page';
import { AbsencesPage } from '../absences/absences-page';
import { PayslipsPage } from '../payslips/payslips-page';
import { TicketsPage } from '../tickets/tickets-page';

function PageView({ id }: { id: TabId }) {
  if (id === 'employees') return <EmployeesPage />;
  if (id === 'leaves') return <LeavesPage />;
  if (id === 'holidays') return <HolidaysPage />;
  if (id === 'absences') return <AbsencesPage />;
  if (id === 'tickets') return <TicketsPage />;
  if (id === 'payslips') return <PayslipsPage />;
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