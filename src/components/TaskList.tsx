import { useRef } from 'react';
import { TaskRow } from '@/components/TaskRow';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFlip } from '@/hooks/useFlip';
import type { Filter, Status, Task } from '@/lib/tasks';
import { useMotion } from '@/providers/MotionProvider';

interface TaskListProps {
  tasks: Task[];
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onSelect: (id: string) => void;
  onStatus: (id: string, status: Status) => void;
  onRemove: (id: string) => void;
}

export function TaskList({
  tasks,
  filter,
  onFilterChange,
  onSelect,
  onStatus,
  onRemove,
}: TaskListProps) {
  const { active } = useMotion();
  const listRef = useRef<HTMLUListElement>(null);
  // Completing a task moves it below the open ones; FLIP animates the move.
  useFlip(listRef, active);

  return (
    <section className="flex flex-col gap-3">
      <Tabs
        value={filter}
        onValueChange={(value) => onFilterChange(value as Filter)}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
        </TabsList>
      </Tabs>

      <ul
        ref={listRef}
        className="task-list flex flex-col gap-2"
        aria-label="Tasks"
      >
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onSelect={onSelect}
            onStatus={onStatus}
            onRemove={onRemove}
          />
        ))}
        {tasks.length === 0 && (
          <li className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            {filter === 'done'
              ? 'Nothing completed yet.'
              : 'Nothing here. Add a task above.'}
          </li>
        )}
      </ul>
    </section>
  );
}
