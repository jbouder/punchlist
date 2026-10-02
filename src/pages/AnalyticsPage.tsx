import type { CSSProperties } from 'react';
import { PageHeader } from '@/components/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { percent, timeAgo } from '@/lib/format';
import type { Priority, Task } from '@/lib/tasks';
import { memberName, workloads } from '@/lib/team';
import { cn } from '@/lib/utils';
import { useTasks } from '@/providers/TasksProvider';

const PRIORITY_COLOR: Record<Priority, string> = {
  high: 'bg-destructive',
  medium: 'bg-foreground/70',
  low: 'bg-foreground/30',
};

interface ActivityEvent {
  id: string;
  at: number;
  text: string;
  kind: 'created' | 'completed';
}

function activity(tasks: Task[]): ActivityEvent[] {
  const events: ActivityEvent[] = [];
  for (const task of tasks) {
    events.push({
      id: `${task.id}-created`,
      at: task.createdAt,
      kind: 'created',
      text: `${memberName(task.assignee)} picked up "${task.title}"`,
    });
    if (task.completedAt) {
      events.push({
        id: `${task.id}-done`,
        at: task.completedAt,
        kind: 'completed',
        text: `${memberName(task.assignee)} completed "${task.title}"`,
      });
    }
  }
  return events.sort((a, b) => b.at - a.at);
}

export function AnalyticsPage() {
  const { tasks } = useTasks();
  const open = tasks.filter((t) => t.status === 'open');
  const done = tasks.filter((t) => t.status === 'done');
  const highOpen = open.filter((t) => t.priority === 'high');
  const loads = workloads(tasks);
  const maxOpen = Math.max(1, ...loads.map((l) => l.open.length));
  const byPriority = (['high', 'medium', 'low'] as const).map((p) => ({
    priority: p,
    count: open.filter((t) => t.priority === p).length,
  }));
  const events = activity(tasks);

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Where the work is, and who has it. Numbers count up, bars grow in, the feed reveals as it scrolls."
      />

      <section
        aria-label="Summary"
        className="grid grid-cols-2 gap-3 xl:grid-cols-4"
      >
        <Stat index={0} label="Open" value={open.length} />
        <Stat index={1} label="Completed" value={done.length} />
        <Stat
          index={2}
          label="Completion rate"
          value={percent(done.length, tasks.length)}
          suffix="%"
        />
        <Stat
          index={3}
          label="High priority open"
          value={highOpen.length}
          tone={highOpen.length > 0 ? 'warn' : 'default'}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <Card className="stagger-in" style={{ '--i': 4 } as CSSProperties}>
          <CardHeader>
            <CardTitle>Open tasks by member</CardTitle>
            <CardDescription>
              Bars scale from zero with a 60 ms stagger; nothing changes layout.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid h-40 grid-cols-4 items-end gap-4">
              {loads.map(({ member, open: openTasks }, i) => (
                <li
                  key={member.initials}
                  className="flex h-full flex-col items-center justify-end gap-2"
                >
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {openTasks.length}
                  </span>
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="bar-fill h-full w-full bg-foreground/80"
                      style={
                        {
                          '--p': openTasks.length / maxOpen,
                          '--i': i,
                        } as CSSProperties
                      }
                      role="img"
                      aria-label={`${member.name}: ${openTasks.length} open`}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {member.initials}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="stagger-in" style={{ '--i': 5 } as CSSProperties}>
          <CardHeader>
            <CardTitle>Open by priority</CardTitle>
            <CardDescription>
              {open.length} open task{open.length === 1 ? '' : 's'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div
              className="flex h-3 w-full gap-px overflow-hidden bg-muted"
              role="img"
              aria-label={byPriority
                .map((b) => `${b.count} ${b.priority}`)
                .join(', ')}
            >
              {byPriority
                .filter((b) => b.count > 0)
                .map((b, i) => (
                  <div
                    key={b.priority}
                    className={cn(
                      'segment-fill h-full',
                      PRIORITY_COLOR[b.priority],
                    )}
                    style={
                      {
                        width: `${percent(b.count, open.length)}%`,
                        '--i': i,
                      } as CSSProperties
                    }
                  />
                ))}
            </div>
            <ul className="flex flex-col gap-2 text-sm">
              {byPriority.map((b) => (
                <li
                  key={b.priority}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-2 capitalize">
                    <span
                      aria-hidden="true"
                      className={cn('size-2.5', PRIORITY_COLOR[b.priority])}
                    />
                    {b.priority}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {b.count} · {percent(b.count, open.length)}%
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <Card className="stagger-in" style={{ '--i': 6 } as CSSProperties}>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>
            Scroll the feed: rows reveal on a scroll-driven timeline, not a
            scroll listener.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="scrollbar-thin flex max-h-64 flex-col gap-1 overflow-y-auto pr-2">
            {events.map((event) => (
              <li
                key={event.id}
                className="reveal flex items-baseline gap-3 border-b py-2 text-sm last:border-b-0"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-1.5 size-2 shrink-0 self-start rounded-full',
                    event.kind === 'completed'
                      ? 'bg-foreground'
                      : 'bg-muted-foreground/50',
                  )}
                />
                <span className="min-w-0 flex-1">{event.text}</span>
                <time
                  dateTime={new Date(event.at).toISOString()}
                  className="shrink-0 font-mono text-[11px] text-muted-foreground"
                >
                  {timeAgo(event.at)}
                </time>
              </li>
            ))}
            {events.length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">
                No activity yet.
              </li>
            )}
          </ol>
        </CardContent>
      </Card>
    </>
  );
}

interface StatProps {
  index: number;
  label: string;
  value: number;
  suffix?: string;
  tone?: 'default' | 'warn';
}

/**
 * The number counts up with CSS alone: a registered `--num` custom property
 * transitions from `@starting-style` (0) to the real value and is rendered
 * through `counter()`. The real value is in the DOM for assistive tech.
 */
function Stat({ index, label, value, suffix, tone = 'default' }: StatProps) {
  return (
    <Card
      size="sm"
      className="stagger-in"
      style={{ '--i': index } as CSSProperties}
    >
      <CardContent className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span
          className={cn(
            'font-heading text-3xl font-semibold tabular-nums',
            tone === 'warn' && 'text-destructive',
          )}
        >
          <span className="sr-only">
            {value}
            {suffix}
          </span>
          <span
            aria-hidden="true"
            className="stat-value"
            style={{ '--n': value } as CSSProperties}
          />
          {suffix && <span aria-hidden="true">{suffix}</span>}
        </span>
      </CardContent>
    </Card>
  );
}
