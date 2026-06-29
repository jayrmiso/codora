# Frame: Milestone 1 Auth, Onboarding, and App Shell

## Goal

Implement the first product milestone so a signed-in user can complete profile onboarding, land on a useful authenticated home page, and remain protected by the existing auth gate.

## Main Mechanic

The mechanic is a short post-auth setup flow that captures `proficiency_level` and learning tags, then routes the user into `/home`, where the app presents the authenticated shell and a dashboard-oriented starting point.

## Repo Facts

- The app uses the Next.js App Router under `src/app`.
- Auth pages already exist at `/sign-in` and `/sign-up`.
- Authentication is handled with Supabase session cookies and route protection in `src/proxy.ts`.
- `/` currently redirects to `/home`.
- `/home` currently loads the session server-side and renders a protected workspace shell.
- Auth signup already sends `full_name`, and the database now supports `profiles.proficiency_level` plus `profile_learning_tags`.
- The remote Supabase schema already has the onboarding-related tables and taxonomy seed data.
- `docs/milestones.md` defines this milestone as auth, onboarding, and app shell.

## Scope

Build the user-facing pieces needed to complete the first milestone:

- sign-up can capture or hand off onboarding state
- onboarding collects `proficiency_level`
- onboarding collects learning tag selections
- onboarding data persists to the existing Supabase profile tables
- `/home` becomes the polished authenticated landing page
- route protection keeps unauthenticated users out of protected pages and authenticated users out of auth screens

## Likely Affected Areas

- `src/app/(auth)/sign-up/page.tsx`
- `src/app/(auth)/_components/auth-form.tsx`
- `src/app/(auth)/layout.tsx`
- a new onboarding route under `src/app/(auth)/onboarding/`
- `src/app/home/page.tsx`
- `src/app/_components/home-page.tsx`
- `src/app/api/auth/sign-up/route.ts`
- `src/app/api/auth/session/route.ts`
- `src/app/api/auth/_lib.ts`
- `src/infrastructure/supabase/auth.ts`
- `src/infrastructure/supabase/types.ts`
- `src/proxy.ts`
- `src/app/globals.css`

## Implementation Steps

1. Decide the onboarding handoff:
   - after sign-up, route the user to onboarding instead of dropping them directly into `/home`
   - if the user already has a complete profile, let them proceed to `/home`
2. Add a dedicated onboarding page or route group that captures:
   - `proficiency_level`
   - learning tag selections
3. Persist onboarding choices through the existing Supabase-backed profile tables.
4. Update auth/session loading so the app can tell whether onboarding is complete.
5. Update `/home` so it becomes the polished authenticated landing page rather than a placeholder session check.
6. Keep the auth pages visually aligned with the existing dark shell and avoid inline styles.
7. Preserve route protection in `src/proxy.ts` so unauthenticated users still go to `/sign-in` and authenticated users stay out of auth routes.

## Acceptance Checks

- A new user can sign up, complete onboarding, and reach `/home`.
- A returning user with a complete profile goes straight to `/home`.
- A returning user without onboarding is redirected into the onboarding flow.
- Learning tag selections persist to `profile_learning_tags`.
- `proficiency_level` persists to `profiles`.
- `/sign-in` and `/sign-up` still work with existing auth behavior.
- `/home` remains protected and renders a real authenticated shell.
- `npm run lint` passes.
- `npm run build` passes.

## Risks

- Onboarding state can become ambiguous if we do not define a clear completion check.
- The sign-up flow may need a redirect change if we choose onboarding after account creation.
- The profile/session API may need a small expansion to expose onboarding completeness.
- A polished `/home` can grow into a dashboard feature too early if we do not keep the first pass focused.

## Non-Goals

- Problem library pages
- Problem session/editor implementation
- Submission runtime and grading
- Progress and leaderboard analytics
- Reviewer library pages

