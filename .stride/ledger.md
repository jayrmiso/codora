# Stride Ledger

This file records durable project knowledge discovered while using Stride.

## Current State

- Stride has been initialized for this project.
- `framer-motion` and `lucide-react` were added to `package.json` and locked in `package-lock.json`.

## Decisions

- Stride is a frame-and-carry workflow, not a named-agent orchestration system.
- Token use should be value-aware, not merely minimized.
- Core lifecycle is `$stride touch` for tiny changes or `$stride frame` -> `$stride carry` -> manual test -> `$stride land` for larger work.
- Frontend systemization uses `$stride kit ui`.
- In this repo, `src/app` is the App Router surface, `src/components` is for reusable shared UI, `src/features` is for feature-scoped components and logic, and route-only components should stay near the route under `src/app/<route>/_components`.
- The UI theme direction is anchored on `reference_js/6.js` and `reference_js/template.css`: dark black surfaces, subtle grid/orb atmosphere, thin borders, muted foreground text, and rounded premium panels.
- Backend work should come before frontend auth/UI work when auth-dependent screens are involved.
- Planned auth stack: Supabase Auth for identity and Supabase Postgres for application user tables.
- Auth routes live under `src/app/(auth)/...`, the protected workspace is `/`, and route protection is handled in `src/proxy.ts` using cookie checks.
- `reference_js` is reference-only material and should be excluded from ESLint.
- Application code should not use inline `style` props; use classes or CSS instead.

## Open Questions

- Add project-specific conventions as they are discovered.
