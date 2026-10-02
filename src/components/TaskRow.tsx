import { CheckIcon, TrashIcon } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Priority, Status, Task } from '@/lib/tasks';
import { cn } from '@/lib/utils';

interface TaskRowProps {
  task: Task;
  onSelect: (id: string) => void;
  onStatus: (id: string, status: Status) => void;
  onRemove: (id: string) => void;
}

const PRIORITY_VARIANT: Record<
  Priority,
  'destructive' | 'secondary' | 'outline'
> = {
  high: 'destructive',
  medium: 'secondary',
  low: 'outline',
};

export function TaskRow({ task, onSelect, onStatus, onRemove }: TaskRowProps) {
  const done = task.status === 'done';

  return (
    <li
      id={`task-${task.id}`}
      data-flip-id={task.id}
      className={cn(
        'task-row group flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5',
        'transition-[border-color,background-color] duration-(--duration-base) ease-(--ease-standard)',
        'hover:border-foreground/20',
        done && 'bg-card/50',
      )}
    >
      <button
        type="button"
        aria-pressed={done}
        aria-label={done ? 'Reopen task' : 'Complete task'}
        onClick={() => onStatus(task.id, done ? 'open' : 'done')}
        className={cn(
          'check press grid size-5 shrink-0 place-items-center rounded-full border',
          'transition-[background-color,border-color] duration-(--duration-fast) ease-(--ease-standard)',
          done
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted-foreground/50 hover:border-foreground',
        )}
      >
        {done && <CheckIcon weight="bold" className="check-mark size-3" />}
      </button>

      <button
        type="button"
        onClick={() => onSelect(task.id)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <span
          className={cn(
            'min-w-0 flex-1 truncate text-sm',
            'transition-[color,text-decoration-color] duration-(--duration-base) ease-(--ease-standard)',
            done &&
              'text-muted-foreground line-through decoration-muted-foreground/60',
          )}
        >
          {task.title}
        </span>
        <Badge
          variant={PRIORITY_VARIANT[task.priority]}
          className="hidden capitalize sm:inline-flex"
        >
          {task.priority}
        </Badge>
        <span className="hidden w-14 shrink-0 text-right font-mono text-[11px] text-muted-foreground sm:inline">
          {task.due}
        </span>
        <span
          role="img"
          aria-label={`Assigned to ${task.assignee}`}
          className="grid size-6 shrink-0 place-items-center rounded-full bg-muted font-mono text-[10px] text-muted-foreground"
        >
          {task.assignee}
        </span>
      </button>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Delete task"
        onClick={() => onRemove(task.id)}
        className={cn(
          'press size-7 text-muted-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
          'transition-opacity duration-(--duration-fast)',
        )}
      >
        <TrashIcon />
      </Button>
    </li>
  );
}
