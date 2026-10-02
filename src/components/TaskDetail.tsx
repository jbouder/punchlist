import { TrashIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ASSIGNEES, type Priority, type Status, type Task } from '@/lib/tasks';
import { cn } from '@/lib/utils';

interface TaskDetailProps {
  task: Task | null;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onStatus: (id: string, status: Status) => void;
  onRemove: (id: string) => void;
}

const PRIORITIES: Priority[] = ['high', 'medium', 'low'];

export function TaskDetail({
  task,
  onClose,
  onUpdate,
  onStatus,
  onRemove,
}: TaskDetailProps) {
  return (
    <Sheet open={task !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="gap-0 p-0">
        {task && (
          <>
            <SheetHeader className="border-b px-5 py-4">
              <SheetTitle className="text-base">Task</SheetTitle>
              <SheetDescription>
                {task.status === 'done' ? 'Completed' : 'Open'} · due {task.due}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-4 text-sm">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="detail-title">Title</Label>
                <Input
                  id="detail-title"
                  value={task.title}
                  onChange={(e) => onUpdate(task.id, { title: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="detail-notes">Notes</Label>
                <textarea
                  id="detail-notes"
                  value={task.notes}
                  rows={3}
                  onChange={(e) => onUpdate(task.id, { notes: e.target.value })}
                  placeholder="Add context for whoever picks this up"
                  className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <fieldset className="flex flex-col gap-1.5">
                <legend className="mb-1.5 text-sm font-medium">Priority</legend>
                <div className="flex gap-1.5">
                  {PRIORITIES.map((p) => (
                    <Button
                      key={p}
                      type="button"
                      size="sm"
                      variant={task.priority === p ? 'default' : 'outline'}
                      className="press capitalize"
                      aria-pressed={task.priority === p}
                      onClick={() => onUpdate(task.id, { priority: p })}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-1.5">
                <legend className="mb-1.5 text-sm font-medium">Assignee</legend>
                <div className="flex gap-1.5">
                  {ASSIGNEES.map((a) => (
                    <button
                      key={a}
                      type="button"
                      aria-pressed={task.assignee === a}
                      aria-label={`Assign to ${a}`}
                      onClick={() => onUpdate(task.id, { assignee: a })}
                      className={cn(
                        'press grid size-8 place-items-center rounded-full border font-mono text-[11px]',
                        'transition-[background-color,border-color,color] duration-(--duration-fast) ease-(--ease-standard)',
                        task.assignee === a
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:border-foreground/40',
                      )}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <SheetFooter className="flex-row justify-between border-t px-5 py-4">
              <Button
                variant="ghost"
                size="sm"
                className="press text-muted-foreground"
                onClick={() => onRemove(task.id)}
              >
                <TrashIcon />
                Delete
              </Button>
              <Button
                size="sm"
                className="press"
                onClick={() =>
                  onStatus(task.id, task.status === 'done' ? 'open' : 'done')
                }
              >
                {task.status === 'done' ? 'Reopen' : 'Mark done'}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
