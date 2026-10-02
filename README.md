# Punchlist

Punchlist is a small team task tracker with a light/dark toggle and one
motion switch in the sidebar. With
motion on, the app uses the platform's current motion features; with motion
off, every change is a cut. Same app, same data, so you can judge what the
motion is actually telling you.

Four pages share a sidebar: **Tasks** (the list), **Analytics** (counts, bars,
an activity feed), **Team** (per-member workload) and **Admin** (workspace
settings, new-task defaults, reset and clear). Moving between them is the
page-transition demo.

Built as the live demo for the talk **Modern Web Motion: Advanced Techniques,
Everyday UI**. Its playground sibling is
[motion-lab](https://github.com/jbouder/motion-lab).

Live: https://jbouder.github.io/punchlist/

## What the switch controls

| Interaction | Kind of motion | Technique |
|---|---|---|
| New task appears | state change (enter) | `@starting-style` transition |
| Toast appears and leaves | state change (enter/exit) | `@starting-style` + `transition-behavior: allow-discrete` |
| Completing a task moves it down | layout change | FLIP with `element.animate()` |
| Deleting a task | state change (exit) | WAAPI, then unmount |
| Switching All / Open / Done | navigation | View Transitions on the list's own snapshot |
| Opening the detail panel | state change | Base UI `data-starting-style` / `data-ending-style` |
| Check mark, press feedback | feedback | `transform` on `:active`, spring baked into `linear()` |
| Changing page | navigation | View Transitions: old page lifts out, new one settles in, direction follows history |
| Sidebar's active marker | layout change | `view-transition-name: nav-active` morphs it between items |
| Cards on Analytics, Team, Admin | state change (enter) | `@starting-style` with a per-item `--i` stagger |
| Analytics numbers count up | state change | `@property` integer + `counter()`, transitioned from `@starting-style` |
| Chart bars grow in | state change (enter) | `scale` from 0 with `@starting-style`, `transform` only |
| Activity feed rows | scroll-linked | `animation-timeline: view()` inside the feed's own scroller |
| "Clear all tasks" confirm | state change | Base UI dialog `data-starting-style` / `data-ending-style` |
| Light / dark toggle | state change | View Transition on the root snapshot: a 200 ms crossfade, nothing more |

One attribute, `html[data-motion="off"]`, zeroes every CSS duration and delay
and switches off the scroll-driven animation by name (scroll timelines ignore
duration); the JS helpers in `src/lib/motion.ts` read the same flag.
`withViewTransition()` also puts the transition's type on `html[data-vt]` so
`view-transition-name`s are only present while their own transition runs. `prefers-reduced-motion`
is a hard override: when it is on, the switch is disabled and nothing animates.

Durations and easings come from tokens (`--duration-fast/base/slow`,
`--ease-standard/emphasized`), the same vocabulary as the Nebari design
system. No animation libraries.

## Stack

React 19 + TypeScript + Vite 7, Tailwind CSS v4, stock shadcn (base-lyra style
on Base UI), Oxanium + JetBrains Mono, Phosphor icons. Biome for format and
lint. Routing is a 70-line `history.pushState` router in `src/lib/router.ts`
(GitHub Pages serves `404.html` for deep links). State is local and persists
to `localStorage` (`punchlist:*`).

## Commands

```bash
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run check    # biome format + lint + organize imports
```

Deploys to GitHub Pages from `main` via `.github/workflows/deploy.yml`.
