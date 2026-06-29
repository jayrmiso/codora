# Stride Ledger

This file records durable project knowledge discovered while using Stride.

## Current State

- Stride has been initialized for this project.

## Decisions

- Stride is a frame-and-carry workflow, not a named-agent orchestration system.
- Token use should be value-aware, not merely minimized.
- Core lifecycle is `$stride touch` for tiny changes or `$stride frame` -> `$stride carry` -> manual test -> `$stride land` for larger work.
- Frontend systemization uses `$stride kit ui`.
- Auth routes live under `src/app/(auth)/...`, the protected workspace is `/home`, and `/` redirects there.
- Route protection is handled in `src/proxy.ts` using cookie checks.
- The sign-in page must forward browser cookies to `/api/auth/session` to avoid auth loops.
- GitHub auth is initiated through `src/app/api/auth/github/route.ts` and completed by consuming the `#access_token=...` fragment on `/sign-in`, then POSTing it to `/api/auth/complete-oauth`.
- OAuth start links that point at API routes should use plain anchors or buttons, not `next/link`, so Next does not prefetch them as RSC pages.
- The auth page copy should describe Codora, not generic auth plumbing.
- Product concept docs live under `docs/` as markdown extracts from the source PDFs: product concept, technical architecture, open questions, and decisions.
- Database setup work should stay schema-first: existing auth/profile migration remains, and new core entities should be added in separate migrations before CRUD and submission APIs.
- `.env.local` already contains direct Postgres connection variables (`DATABASE_*`), but the app has not yet exposed a dedicated database config helper for server/database work.
- Core database foundation now includes `src/infrastructure/database/config.ts`, a schema migration for topics/difficulty/tags/problems/attempts/reviewer content, and `profiles.proficiency_level` support.
- Auth signup can now pass `proficiency_level` metadata through Supabase so the profile trigger can persist it.
- Starter taxonomy data is seeded through `supabase/migrations/20260630010000_seed_core_taxonomy.sql`.
- Verified with `npm run lint` and `npm run build`.
- Applied the migrations to the remote Supabase project and verified the `public` tables now exist there.
- The product build sequence is now captured in `docs/milestones.md` with milestone-level task splits.
- Milestone 1 now includes a dedicated `/onboarding` flow for `proficiency_level` and learning tag selection, with `/home` redirecting incomplete profiles there.
- Session state now includes `onboardingComplete` and `learningTagIds`, which the auth form and home page use to route users correctly.

## Open Questions

- Add project-specific conventions as they are discovered.
