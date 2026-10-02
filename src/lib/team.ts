import type { Task } from '@/lib/tasks';

export interface Member {
  initials: string;
  name: string;
  role: string;
}

/** The same four people the assignee picker offers, with names for the Team page. */
export const MEMBERS: readonly Member[] = [
  { initials: 'JB', name: 'Johnny B.', role: 'Engineering lead' },
  { initials: 'AK', name: 'Ana K.', role: 'Frontend' },
  { initials: 'MR', name: 'Marcus R.', role: 'Platform' },
  { initials: 'SL', name: 'Sam L.', role: 'Infrastructure' },
];

export function memberName(initials: string): string {
  return MEMBERS.find((m) => m.initials === initials)?.name ?? initials;
}

export interface Workload {
  member: Member;
  open: Task[];
  done: Task[];
}

export function workloads(tasks: Task[]): Workload[] {
  return MEMBERS.map((member) => ({
    member,
    open: tasks.filter(
      (t) => t.assignee === member.initials && t.status === 'open',
    ),
    done: tasks.filter(
      (t) => t.assignee === member.initials && t.status === 'done',
    ),
  }));
}
