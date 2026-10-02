export type Priority = 'high' | 'medium' | 'low';
export type Status = 'open' | 'done';
export type Filter = 'all' | 'open' | 'done';

export interface Task {
  id: string;
  title: string;
  notes: string;
  assignee: string;
  priority: Priority;
  due: string;
  status: Status;
  createdAt: number;
  completedAt?: number;
}

export const ASSIGNEES = ['JB', 'AK', 'MR', 'SL'] as const;

export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const STORAGE_KEY = 'punchlist:tasks';

let seq = 0;
export function newId() {
  seq += 1;
  return `t${Date.now().toString(36)}${seq}`;
}

function task(
  title: string,
  assignee: string,
  priority: Priority,
  due: string,
  notes: string,
  status: Status = 'open',
): Task {
  return {
    id: newId(),
    title,
    notes,
    assignee,
    priority,
    due,
    status,
    createdAt: Date.now() - seq * 60_000,
    completedAt: status === 'done' ? Date.now() - seq * 20_000 : undefined,
  };
}

export function seedTasks(): Task[] {
  return [
    task(
      'Rotate Keycloak client secrets',
      'JB',
      'high',
      'Oct 3',
      'Staging first, then production after the smoke test passes.',
    ),
    task(
      'Review PR #412: collab hub sidebar',
      'AK',
      'high',
      'Oct 3',
      'Focus on keyboard navigation and the collapsed state.',
    ),
    task(
      'Fix flaky deploy job on main',
      'MR',
      'medium',
      'Oct 6',
      'Fails about one run in five on the Helm lint step.',
    ),
    task(
      'Upgrade Helm chart to 0.9.0',
      'SL',
      'medium',
      'Oct 8',
      'Values file changed shape; check the ingress block.',
    ),
    task(
      'Set up storage quota alerts',
      'MR',
      'low',
      'Oct 10',
      'Warn at 80%, page at 95%.',
    ),
    task(
      'Write release notes for 2.4',
      'JB',
      'low',
      'Oct 10',
      'Pull highlights from the merged PR list.',
    ),
    task(
      'Onboard new platform engineer',
      'AK',
      'medium',
      'Oct 1',
      'Accounts, cluster access, first-week plan.',
      'done',
    ),
    task(
      'Archive #platform-old channel',
      'SL',
      'low',
      'Sep 30',
      'Pinned links moved to the handbook.',
      'done',
    ),
  ];
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Task[];
      // An empty array is a real state (the user cleared the list); only a
      // missing or corrupt key falls back to the sample data.
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Fall through to the seed.
  }
  return seedTasks();
}

export function saveTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Storage unavailable; the session still works.
  }
}

/** Open tasks first by priority, then done tasks, newest first within a group. */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'open' ? -1 : 1;
    }
    if (a.status === 'open' && a.priority !== b.priority) {
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    }
    return b.createdAt - a.createdAt;
  });
}

export function filterTasks(tasks: Task[], filter: Filter): Task[] {
  if (filter === 'all') {
    return tasks;
  }
  return tasks.filter((t) => t.status === filter);
}
