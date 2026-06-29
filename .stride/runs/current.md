# Current Run

## Active Worktree

- Path: `/Users/kai/Documents/dev/codora/.stride/worktrees/backend-auth-api`
- Branch: `stride/backend-auth-api`
- Remote: `https://github.com/jayrmiso/codora`

## Status

- Landed

## What Changed

- Added Supabase auth infrastructure helpers in `src/infrastructure/supabase/` for sign-up, sign-in, sign-out, session refresh, and profile loading.
- Added backend auth route handlers under `src/app/api/auth/` for `sign-up`, `sign-in`, `sign-out`, and `session`.
- Added a Supabase SQL migration that creates `public.profiles`, applies RLS, and wires an `auth.users` insert trigger to seed the profile row.
- Added `.env.example` entries for `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

## What to Check

- `GET /api/auth/session` returns a clean 500 JSON error when Supabase env vars are missing.
- `POST /api/auth/sign-in` and `POST /api/auth/sign-up` return clean 500 JSON errors when Supabase env vars are missing.
- Once Supabase env vars are provided, the routes should create, read, refresh, and clear auth cookies correctly.

## Checks Run

- `npm run lint`
- `npm run build`
- `curl --max-time 5 -i http://localhost:3010/api/auth/session`
- `curl --max-time 5 -i -X POST http://localhost:3010/api/auth/sign-in -H 'Content-Type: application/json' -d '{"email":"test@example.com","password":"password123"}'`

## Next Command

- None

## PR

- https://github.com/jayrmiso/codora/pull/1
