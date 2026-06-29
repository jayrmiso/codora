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
- The UI theme direction is anchored on `reference_js/6.js` and `reference_js/template.css`: dark black surfaces, subtle grid/orb atmosphere, thin borders, muted foreground text, and rounded premium panels.
- Backend work should come before frontend auth/UI work when auth-dependent screens are involved.
- Planned auth stack: Supabase Auth for identity and Supabase Postgres for application user tables.

## Open Questions

- Add project-specific conventions as they are discovered.
