# AGENTS.md — punchlist

Guidance for AI agents working in this repository.

## What this is

A deliberately small task tracker that demonstrates UI motion with a single
on/off switch. The product behavior must be identical in both modes; only the
motion differs. Keep it small: this is a talk demo, not a product.

## Stack

React 19 + TypeScript + Vite 7 · Tailwind CSS v4 (CSS-first, configured in
`src/index.css`) · stock shadcn `base-lyra` on Base UI (`src/components/ui`,
CLI-managed, do not hand-edit) · Phosphor icons · Biome. No router, no data
library, no tests (verify in the browser).

## Rules

- **No animation libraries.** The point is the platform: View Transitions,
  WAAPI, `@starting-style`, CSS `linear()` springs. Helpers live in
  `src/lib/motion.ts` and `src/hooks/useFlip.ts`.
- **Everything respects the switch.** CSS reads `html[data-motion="off"]`;
  JS helpers take `enabled` from `useMotion().active`. Never animate behind
  the switch's back.
- **Reduced motion is a hard override**, not a preference. Content always
  renders in its final state; nothing is ever stuck at `opacity: 0`.
- **Tokens, not literals.** `var(--duration-base)`, `var(--ease-emphasized)`,
  or Tailwind's `duration-(--duration-base)` form (parentheses, not brackets).
- **Animate `opacity` and `transform` only** (`translate`, `scale`). Position
  changes go through FLIP or View Transitions.
- Motion styling belongs in `src/index.css` or at the call site, never in
  `src/components/ui/*`.

## Commands

```bash
npm run build && npm run check   # run both before finishing any change
```
