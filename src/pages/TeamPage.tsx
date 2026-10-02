import { CaretRightIcon } from '@phosphor-icons/react';
import type { CSSProperties } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { workloads } from '@/lib/team';
import { useTasks } from '@/providers/TasksProvider';

export function TeamPage() {
  const { tasks, select } = useTasks();
  const loads = workloads(tasks);
  const maxOpen = Math.max(1, ...loads.map((l) => l.open.length));

  return (
    <>
      <PageHeader
        title="Team"
        description="Four people, one list. Open a task from here and the same detail panel slides in."
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loads.map(({ member, open, done }, i) => (
          <Card
            key={member.initials}
            className="stagger-in"
            style={{ '--i': i } as CSSProperties}
          >
            <CardHeader className="grid-cols-[auto_1fr] gap-x-3">
              <span
                aria-hidden="true"
                className="row-span-2 grid size-10 place-items-center rounded-full bg-muted font-mono text-xs text-muted-foreground"
              >
                {member.initials}
              </span>
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>{member.role}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-mono text-[11px] text-muted-foreground tabular-nums">
                  <span>{open.length} open</span>
                  <span>{done.length} done</span>
                </div>
                <div className="h-1.5 w-full bg-muted">
                  <div
                    className="bar-fill horizontal h-full bg-foreground/80"
                    style={
                      {
                        '--p': open.length / maxOpen,
                        '--i': i,
                      } as CSSProperties
                    }
                    role="img"
                    aria-label={`${open.length} of ${maxOpen} open, relative to the busiest member`}
                  />
                </div>
              </div>

              <ul className="flex flex-col divide-y">
                {open.map((task) => (
                  <li key={task.id}>
                    <button
                      type="button"
                      onClick={() => select(task.id)}
                      className="press group flex w-full items-center gap-2 py-2 text-left text-sm hover:text-foreground"
                    >
                      <span className="min-w-0 flex-1 truncate">
                        {task.title}
                      </span>
                      {task.priority === 'high' && (
                        <Badge variant="destructive">high</Badge>
                      )}
                      <CaretRightIcon className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-(--duration-fast) ease-(--ease-standard) group-hover:translate-x-0.5" />
                    </button>
                  </li>
                ))}
                {open.length === 0 && (
                  <li className="py-3 text-sm text-muted-foreground">
                    Nothing open.
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
