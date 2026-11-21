import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { HealthBadge } from '@/features/health/health-badge';

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-white text-slate-900">
      <Outlet />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">NEXORA</h1>
      <HealthBadge />
    </main>
  ),
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
