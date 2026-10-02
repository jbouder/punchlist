import { useCallback, useEffect, useMemo, useState } from 'react';
import { AddTask } from '@/components/AddTask';
import { Header } from '@/components/Header';
import { TaskDetail } from '@/components/TaskDetail';
import { TaskList } from '@/components/TaskList';
import { Toast, type ToastMessage } from '@/components/Toast';
import { animateOut, withViewTransition } from '@/lib/motion';
import {
  type Filter,
  filterTasks,
  loadTasks,
  newId,
  saveTasks,
  sortTasks,
  type Task,
} from '@/lib/tasks';
import { MotionProvider, useMotion } from '@/providers/MotionProvider';

export default function App() {
  return (
    <MotionProvider>
      <Tracker />
    </MotionProvider>
  );
}

function Tracker() {
  const motion = useMotion();
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const visible = useMemo(
    () => filterTasks(sortTasks(tasks), filter),
    [tasks, filter],
  );
  const openCount = tasks.filter((t) => t.status === 'open').length;
  const selected = tasks.find((t) => t.id === selectedId) ?? null;

  const addTask = useCallback((title: string) => {
    const task: Task = {
      id: newId(),
      title,
      notes: '',
      assignee: 'JB',
      priority: 'medium',
      due: 'Next week',
      status: 'open',
      createdAt: Date.now(),
    };
    setTasks((prev) => [task, ...prev]);
  }, []);

  const setStatus = useCallback(
    (id: string, status: Task['status']) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
      const task = tasks.find((t) => t.id === id);
      if (task && status === 'done') {
        setToast({
          id: newId(),
          text: `Completed "${task.title}"`,
          undo: () => setStatus(id, 'open'),
        });
      }
    },
    [tasks],
  );

  const removeTask = useCallback(
    async (id: string) => {
      const el = document.getElementById(`task-${id}`);
      if (el) {
        await animateOut(el, motion.active);
      }
      setSelectedId((cur) => (cur === id ? null : cur));
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [motion.active],
  );

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const changeFilter = useCallback(
    (next: Filter) => {
      // A view transition crossfades the whole list between filters.
      withViewTransition(() => setFilter(next), motion.active);
    },
    [motion.active],
  );

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
      <Header openCount={openCount} total={tasks.length} />
      <main className="flex flex-col gap-4">
        <AddTask onAdd={addTask} />
        <TaskList
          tasks={visible}
          filter={filter}
          onFilterChange={changeFilter}
          onSelect={setSelectedId}
          onStatus={setStatus}
          onRemove={removeTask}
        />
      </main>
      <TaskDetail
        task={selected}
        onClose={() => setSelectedId(null)}
        onUpdate={updateTask}
        onStatus={setStatus}
        onRemove={removeTask}
      />
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
