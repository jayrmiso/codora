# Stride Ledger

This file records durable project knowledge discovered while using Stride.

## Current State

- Stride has been initialized for this project.
- 2026-06-30 15:53:00 AEST: added a dev-only auth bypass for `arjayramiso@gmail.com` with passwords `Arjay123!` and `Jayrmiso123!`; sign-in/sign-up now issue synthetic sessions, `/api/auth/session` and `/api/onboarding/complete` honor the bypass cookies, sign-out clears the bypass onboarding cookie, and `.env.example` documents `AUTH_TEST_BYPASS`; focused eslint and `node --experimental-strip-types --test src/infrastructure/supabase/test-auth.test.ts` passed.
- 2026-06-30 13:51:00 AEST: onboarding was refactored into a three-step milestone/question flow in `src/app/(auth)/onboarding/page.tsx` and `src/app/(auth)/onboarding/_components/onboarding-form.tsx`; added `src/app/(auth)/onboarding/_lib/onboarding-flow.mjs` plus `src/app/(auth)/onboarding/_lib/onboarding-flow.test.mjs` to cover confidence-step readiness and submit payload assembly; targeted lint and `node --test` passed; live Playwright visual audit remained blocked because no browser backend was available and `/onboarding` redirects without authentication.
- 2026-06-30 11:51:31 AEST: onboarding density patch updated `src/app/(auth)/onboarding/_components/onboarding-form.tsx` and `src/app/(auth)/layout.tsx`; removed redundant selected-language summary UI, compacted per-language rows, widened the onboarding shell; targeted check passed with `../../../node_modules/.bin/eslint 'src/app/(auth)/onboarding/_components/onboarding-form.tsx' 'src/app/(auth)/layout.tsx'`; next action is visual/manual verification on `/onboarding`.

## Decisions

- Stride is a spec-and-impl workflow with explicit worker orchestration.
- Token use should be value-aware, not merely minimized.
- Core lifecycle is `$stride patch` for tiny changes or `$stride spec` -> `$stride impl` -> manual test -> `$stride land` for larger work.
- Frontend systemization uses `$stride kit ui`.

## Open Questions

- Add project-specific conventions as they are discovered.
