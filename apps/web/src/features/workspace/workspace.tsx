import { AgentView } from '@/features/agent/agent-view';
import { PagePlaceholder } from './page-placeholder';
import { Sidebar } from './sidebar';
import { TabBar } from './tab-bar';
import { useWorkspace } from './workspace-store';

export function Workspace() {
  const { active } = useWorkspace();

  return (
    <div className="flex h-screen bg-paper text-ink">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TabBar />
        <main className="min-h-0 flex-1 overflow-y-auto bg-panel">
          <div hidden={active !== 'agent'} className="h-full">
            <AgentView />
          </div>
          {active !== 'agent' && <PagePlaceholder id={active} />}
        </main>
      </div>
    </div>
  );
}