# Stride Ledger

This file records durable project knowledge discovered while using Stride.

## Current State

- Stride has been initialized for this project.
- `framer-motion` and `lucide-react` were added to `package.json` and locked in `package-lock.json`.
- Backend auth now uses Supabase Auth plus a Postgres-backed `public.profiles` table seeded by an `auth.users` trigger.

## Decisions

- Stride is a frame-and-carry workflow, not a named-agent orchestration system.
- Token use should be value-aware, not merely minimized.
- Core lifecycle is `$stride touch` for tiny changes or `$stride frame` -> `$stride carry` -> manual test -> `$stride land` for larger work.
- Frontend systemization uses `$stride kit ui`.
- Auth-dependent frontend work should wait for the backend auth contract to exist first.
- Backend auth routes added: `/api/auth/sign-up`, `/api/auth/sign-in`, `/api/auth/sign-out`, and `/api/auth/session`.
- Required env vars for auth prep are `SUPABASE_URL` and `SUPABASE_ANON_KEY`; `SUPABASE_SERVICE_ROLE_KEY` is reserved for future admin-side operations.

## Open Questions

- Add project-specific conventions as they are discovered.
