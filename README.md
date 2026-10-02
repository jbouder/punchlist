# Punchlist

Punchlist is a small team task tracker with one switch in the header. With motion on, the
app uses the platform's current motion features; with motion off, every change
is a cut. Same app, same data, so you can judge what the motion is actually
telling you.

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

One attribute, `html[data-motion="off"]`, zeroes every CSS duration; the JS
helpers in `src/lib/motion.ts` read the same flag. `prefers-reduced-motion`
is a hard override: when it is on, the switch is disabled and nothing animates.

Durations and easings come from tokens (`--duration-fast/base/slow`,
`--ease-standard/emphasized`), the same vocabulary as the Nebari design
system. No animation libraries.

## Stack

React 19 + TypeScript + Vite 7, Tailwind CSS v4, stock shadcn (base-lyra style
on Base UI), Oxanium + JetBrains Mono, Phosphor icons. Biome for format and
lint. State is local and persists to `localStorage` (`punchlist:*`).

## Commands

```bash
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run check    # biome format + lint + organize imports
```

Deploys to GitHub Pages from `main` via `.github/workflows/deploy.yml`.
