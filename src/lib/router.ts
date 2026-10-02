import { useSyncExternalStore } from 'react';

/**
 * A deliberately small router: four paths, `history.pushState`, and one hook.
 * Route changes go through `runTransition`, which the app shell points at
 * `withViewTransition` so every navigation (clicks and back/forward alike)
 * animates as a page transition when motion is on.
 */

export type Path = '/' | '/analytics' | '/team' | '/admin';
export type Direction = 'forward' | 'back';

export const PATHS: readonly Path[] = ['/', '/analytics', '/team', '/admin'];

// Vite's BASE_URL is "/" in dev and "/punchlist/" on GitHub Pages.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

function isPath(value: string): value is Path {
  return (PATHS as readonly string[]).includes(value);
}

function readPath(): Path {
  const raw = window.location.pathname.slice(BASE.length) || '/';
  const clean = raw.length > 1 ? raw.replace(/\/$/, '') : raw;
  return isPath(clean) ? clean : '/';
}

let current: Path = readPath();
const listeners = new Set<() => void>();

type Transition = (update: () => void, direction: Direction) => void;
let runTransition: Transition = (update) => update();

/** The shell installs the view-transition wrapper here. */
export function setRouteTransition(transition: Transition) {
  runTransition = transition;
}

function commit(next: Path) {
  if (next === current) {
    return;
  }
  const direction: Direction =
    PATHS.indexOf(next) > PATHS.indexOf(current) ? 'forward' : 'back';
  runTransition(() => {
    current = next;
    for (const listener of listeners) {
      listener();
    }
  }, direction);
}

export function navigate(to: Path) {
  if (to === current) {
    return;
  }
  window.history.pushState(null, '', `${BASE}${to}`);
  commit(to);
}

/** A real href so links work with middle-click and "open in new tab". */
export function href(to: Path) {
  return `${BASE}${to}`;
}

window.addEventListener('popstate', () => commit(readPath()));

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useRoute(): Path {
  return useSyncExternalStore(subscribe, () => current);
}
