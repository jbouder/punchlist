import { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TaskDetail } from '@/components/TaskDetail';
import { Toast } from '@/components/Toast';
import { withViewTransition } from '@/lib/motion';
import { setRouteTransition, useRoute } from '@/lib/router';
import { AdminPage } from '@/pages/AdminPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { TasksPage } from '@/pages/TasksPage';
import { TeamPage } from '@/pages/TeamPage';
import { useMotion } from '@/providers/MotionProvider';
import { useTasks } from '@/providers/TasksProvider';

const PAGES = {
  '/': TasksPage,
  '/analytics': AnalyticsPage,
  '/team': TeamPage,
  '/admin': AdminPage,
} as const;

/**
 * Sidebar plus a content area that fills the rest of the viewport and scrolls
 * on its own. Route changes run inside a view transition: `<html data-nav>`
 * carries the direction so the page slides the right way.
 */
export function AppShell() {
  const route = useRoute();
  const { active } = useMotion();
  const tasks = useTasks();
  const Page = PAGES[route];

  useEffect(() => {
    setRouteTransition((update, direction) => {
      document.documentElement.dataset.nav = direction;
      withViewTransition(update, active, 'page');
    });
  }, [active]);

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr] md:h-dvh md:grid-cols-[15rem_1fr] md:grid-rows-1">
      <Sidebar />
      {/* Keyed by route so each page mounts fresh and its entrances replay. */}
      <main key={route} className="page min-h-0 overflow-y-auto scrollbar-thin">
        <div className="flex min-h-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
          <Page />
        </div>
      </main>

      <TaskDetail
        task={tasks.selected}
        onClose={() => tasks.select(null)}
        onUpdate={tasks.updateTask}
        onStatus={tasks.setStatus}
        onRemove={tasks.removeTask}
      />
      <Toast message={tasks.toast} onDismiss={tasks.dismissToast} />
    </div>
  );
}
