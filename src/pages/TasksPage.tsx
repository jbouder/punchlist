import { useCallback, useMemo, useState } from 'react';
import { AddTask } from '@/components/AddTask';
import { PageHeader } from '@/components/PageHeader';
import { TaskList } from '@/components/TaskList';
import { withViewTransition } from '@/lib/motion';
import { type Filter, filterTasks, sortTasks } from '@/lib/tasks';
import { useMotion } from '@/providers/MotionProvider';
import { useTasks } from '@/providers/TasksProvider';

export function TasksPage() {
  const motion = useMotion();
  const { tasks, addTask, select, setStatus, removeTask } = useTasks();
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => filterTasks(sortTasks(tasks), filter),
    [tasks, filter],
  );
  const openCount = tasks.filter((t) => t.status === 'open').length;

  const changeFilter = useCallback(
    (next: Filter) => {
      // The list crossfades on its own snapshot; the rest of the page holds still.
      withViewTransition(() => setFilter(next), motion.active, 'filter');
    },
    [motion.active],
  );

  return (
    <>
      <PageHeader
        title="Tasks"
        description={
          <>
            <span key={openCount} className="count tabular-nums">
              {openCount}
            </span>{' '}
            open · <span className="tabular-nums">{tasks.length}</span> total
          </>
        }
      />
      <div className="flex flex-col gap-4">
        <AddTask onAdd={addTask} />
        <TaskList
          tasks={visible}
          filter={filter}
          onFilterChange={changeFilter}
          onSelect={select}
          onStatus={setStatus}
          onRemove={removeTask}
        />
      </div>
    </>
  );
}
