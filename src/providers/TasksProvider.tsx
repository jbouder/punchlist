import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ToastMessage } from '@/components/Toast';
import { animateOut } from '@/lib/motion';
import {
  loadTasks,
  newId,
  type Status,
  saveTasks,
  seedTasks,
  type Task,
} from '@/lib/tasks';
import { useMotion } from '@/providers/MotionProvider';
import { useSettings } from '@/providers/SettingsProvider';

interface TasksContextValue {
  tasks: Task[];
  /** The task open in the detail panel, if any. */
  selected: Task | null;
  select: (id: string | null) => void;
  addTask: (title: string) => void;
  setStatus: (id: string, status: Status) => void;
  removeTask: (id: string) => Promise<void>;
  updateTask: (id: string, patch: Partial<Task>) => void;
  /** Admin: put the sample data back. */
  resetTasks: () => void;
  /** Admin: delete everything. */
  clearTasks: () => void;
  toast: ToastMessage | null;
  dismissToast: () => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const motion = useMotion();
  const { settings } = useSettings();
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const selected = tasks.find((t) => t.id === selectedId) ?? null;

  const addTask = useCallback(
    (title: string) => {
      const task: Task = {
        id: newId(),
        title,
        notes: '',
        assignee: settings.defaultAssignee,
        priority: settings.defaultPriority,
        due: settings.defaultDue,
        status: 'open',
        createdAt: Date.now(),
      };
      setTasks((prev) => [task, ...prev]);
    },
    [settings],
  );

  const setStatus = useCallback(
    (id: string, status: Status) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status,
                completedAt: status === 'done' ? Date.now() : undefined,
              }
            : t,
        ),
      );
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

  const resetTasks = useCallback(() => {
    setSelectedId(null);
    setTasks(seedTasks());
    setToast({ id: newId(), text: 'Sample data restored' });
  }, []);

  const clearTasks = useCallback(() => {
    const previous = tasks;
    setSelectedId(null);
    setTasks([]);
    setToast({
      id: newId(),
      text: `Deleted ${previous.length} tasks`,
      undo: () => setTasks(previous),
    });
  }, [tasks]);

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
      selected,
      select: setSelectedId,
      addTask,
      setStatus,
      removeTask,
      updateTask,
      resetTasks,
      clearTasks,
      toast,
      dismissToast: () => setToast(null),
    }),
    [
      tasks,
      selected,
      addTask,
      setStatus,
      removeTask,
      updateTask,
      resetTasks,
      clearTasks,
      toast,
    ],
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error('useTasks must be used inside TasksProvider');
  }
  return ctx;
}
