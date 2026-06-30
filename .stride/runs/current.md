Status: Landed

# Current Run

## Active Worktree

- Path: `/Users/kai/Documents/dev/codora/.stride/worktrees/onboarding-step-flow`
- Branch: `stride/onboarding-step-flow`
- Preview URL: `http://127.0.0.1:3000/onboarding`

## What Changed

- Reworked onboarding into a three-step milestone flow.
- Added a dev-only auth bypass for the test account `arjayramiso@gmail.com`.
- Tightened onboarding payload validation and preserved the selected-language/tag experience.

## Verification

- `npx eslint 'src/app/(auth)/onboarding/_components/onboarding-form.tsx' 'src/app/(auth)/onboarding/page.tsx' 'src/app/api/auth/_lib.ts' 'src/app/api/auth/session/route.ts' 'src/app/api/auth/sign-in/route.ts' 'src/app/api/auth/sign-out/route.ts' 'src/app/api/auth/sign-up/route.ts' 'src/app/api/onboarding/complete/route.ts' 'src/infrastructure/supabase/auth.ts' 'src/infrastructure/supabase/cookies.ts' 'src/infrastructure/supabase/test-auth.ts' 'src/infrastructure/supabase/test-auth.test.ts' 'src/app/(auth)/onboarding/_lib/onboarding-flow.mjs' 'src/app/(auth)/onboarding/_lib/onboarding-flow.test.mjs'`
- `node --test --experimental-strip-types 'src/infrastructure/supabase/test-auth.test.ts' 'src/app/(auth)/onboarding/_lib/onboarding-flow.test.mjs'`
- Manual review of the resulting onboarding screens and auth bypass flow

## Landed

- Commit: `9273013 feat(onboarding): add milestone flow and dev auth bypass`
- Root landing commit: `e56117e chore: land onboarding step flow`
