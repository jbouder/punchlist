import { ArrowCounterClockwiseIcon, TrashIcon } from '@phosphor-icons/react';
import { type CSSProperties, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ASSIGNEES, type Priority } from '@/lib/tasks';
import { MEMBERS } from '@/lib/team';
import { cn } from '@/lib/utils';
import { useSettings } from '@/providers/SettingsProvider';
import { useTasks } from '@/providers/TasksProvider';

const PRIORITIES: Priority[] = ['high', 'medium', 'low'];

export function AdminPage() {
  const { settings, update, reset } = useSettings();
  const { tasks, resetTasks, clearTasks } = useTasks();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const storedBytes = (() => {
    try {
      return new Blob([
        localStorage.getItem('punchlist:tasks') ?? '',
        localStorage.getItem('punchlist:settings') ?? '',
      ]).size;
    } catch {
      return 0;
    }
  })();

  return (
    <>
      <PageHeader
        title="Admin"
        description="Workspace settings and the demo's reset switch. Everything here is stored in this browser."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="stagger-in" style={{ '--i': 0 } as CSSProperties}>
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
            <CardDescription>
              The name shows in the sidebar as you type.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1.5">
            <Label htmlFor="workspace-name">Name</Label>
            <Input
              id="workspace-name"
              value={settings.workspace}
              onChange={(e) => update({ workspace: e.target.value })}
              placeholder="Punchlist"
            />
          </CardContent>
        </Card>

        <Card className="stagger-in" style={{ '--i': 1 } as CSSProperties}>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              Who can be assigned. Fixed for the demo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col divide-y text-sm">
              {MEMBERS.map((m) => (
                <li key={m.initials} className="flex items-center gap-3 py-2">
                  <span
                    aria-hidden="true"
                    className="grid size-7 place-items-center rounded-full bg-muted font-mono text-[10px] text-muted-foreground"
                  >
                    {m.initials}
                  </span>
                  <span className="flex-1">{m.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {m.role}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="stagger-in" style={{ '--i': 2 } as CSSProperties}>
          <CardHeader>
            <CardTitle>New task defaults</CardTitle>
            <CardDescription>
              Applied to anything added from the Tasks page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 text-sm">
            <fieldset className="flex flex-col gap-1.5">
              <legend className="mb-1.5 text-sm font-medium">Assignee</legend>
              <div className="flex gap-1.5">
                {ASSIGNEES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={settings.defaultAssignee === a}
                    aria-label={`Default assignee ${a}`}
                    onClick={() => update({ defaultAssignee: a })}
                    className={cn(
                      'press grid size-8 place-items-center rounded-full border font-mono text-[11px]',
                      'transition-[background-color,border-color,color] duration-(--duration-fast) ease-(--ease-standard)',
                      settings.defaultAssignee === a
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:border-foreground/40',
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-1.5">
              <legend className="mb-1.5 text-sm font-medium">Priority</legend>
              <div className="flex gap-1.5">
                {PRIORITIES.map((p) => (
                  <Button
                    key={p}
                    type="button"
                    size="sm"
                    variant={
                      settings.defaultPriority === p ? 'default' : 'outline'
                    }
                    className="press capitalize"
                    aria-pressed={settings.defaultPriority === p}
                    onClick={() => update({ defaultPriority: p })}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="default-due">Due</Label>
              <Input
                id="default-due"
                value={settings.defaultDue}
                onChange={(e) => update({ defaultDue: e.target.value })}
                placeholder="Next week"
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="press text-muted-foreground"
              onClick={reset}
            >
              Restore defaults
            </Button>
          </CardFooter>
        </Card>

        <Card className="stagger-in" style={{ '--i': 3 } as CSSProperties}>
          <CardHeader>
            <CardTitle>Data</CardTitle>
            <CardDescription>
              <span className="tabular-nums">{tasks.length}</span> task
              {tasks.length === 1 ? '' : 's'} ·{' '}
              <span className="tabular-nums">
                {(storedBytes / 1024).toFixed(1)}
              </span>{' '}
              KB in localStorage
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Mid-demo, restore the sample data to get the original eight tasks
            back. Clearing asks first; both can be undone from the toast.
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="press"
              onClick={resetTasks}
            >
              <ArrowCounterClockwiseIcon />
              Restore sample data
            </Button>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <DialogTrigger
                render={
                  <Button
                    variant="destructive"
                    size="sm"
                    className="press"
                    disabled={tasks.length === 0}
                  />
                }
              >
                <TrashIcon />
                Clear all tasks
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Clear all tasks?</DialogTitle>
                  <DialogDescription>
                    This removes {tasks.length} task
                    {tasks.length === 1 ? '' : 's'} from this browser. The toast
                    offers an undo for a few seconds.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" size="sm" />}>
                    Keep them
                  </DialogClose>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="press"
                    onClick={() => {
                      clearTasks();
                      setConfirmOpen(false);
                    }}
                  >
                    Clear everything
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
