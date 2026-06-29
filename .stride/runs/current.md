# Current Run

## Active Worktree

- Path: `/Users/kai/Documents/dev/codora`
- Branch: `main`
- Remote: `https://github.com/jayrmiso/codora`

## Status

- Applied to remote Supabase project and implemented Milestone 1 auth/onboarding/app shell

## What Changed

- Added a direct database connection config helper under `src/infrastructure/database/config.ts`.
- Extended the auth profile trigger to persist `proficiency_level` from auth metadata.
- Added a core schema migration for topics, difficulty levels, learning tags, profile tag selections, problems, problem tags, hidden test cases, attempts, and reviewer articles.
- Added a taxonomy seed migration for starter topics, difficulty levels, and learning tags.
- Updated the Supabase profile type and signup helper to carry `proficiency_level`.
- Documented direct database env variables in `.env.example`.
- Added an onboarding route, onboarding completion API, and shared session loader.
- Updated `/home` to redirect incomplete users to onboarding and render a dashboard-style authenticated shell.
- Updated auth flows to route users to onboarding when their profile is not complete.
- Added `/onboarding` to the proxy protection set.

## What to Check

- `npm run lint`
- `npm run build`
- New migrations apply cleanly in Supabase before any CRUD or submission APIs are added.
- `profiles.proficiency_level` is populated when auth metadata includes it.

## Checks Run

- `npm run lint`
- `npm run build`
- Applied migrations directly to the Supabase database and verified the core `public` tables exist.
- Verified the new onboarding route is included in the built route map.

## Next Command

- Begin problem library and problem session framing/carry work on top of the completed auth/onboarding shell.
