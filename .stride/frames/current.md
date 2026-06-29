# Frame: Backend Auth API First

## Goal

Prepare the backend auth layer before any frontend work. Use Supabase Auth for identity and Supabase Postgres tables for app user records so the frontend can rely on a stable backend contract instead of carrying auth logic itself.

## Repo Facts

- This is a minimal Next.js App Router app with only scaffold route files in `src/app`.
- There is no existing backend auth implementation in the repo yet.
- The repo already uses `@/*` aliasing to `./src/*`.
- The project currently has no Supabase client, auth service, or user table layer.

## Backend Direction

- Supabase Auth owns sign-in, sign-up, session, and token verification.
- Supabase Postgres owns the application user table and any app-specific profile or auth-linked records.
- The frontend should consume backend auth endpoints or server actions only after the backend contract exists.
- Auth-related data should be split between identity in Supabase Auth and application state in Postgres.

## Likely Affected Files

- `src/infrastructure/*` for Supabase client setup and auth/data access wrappers
- `src/domain/*` for user/auth domain models if needed
- `src/app/api/*` if Next route handlers are used for auth endpoints
- `src/shared/*` for request/response utilities or auth guards if they are shared
- `.env.example` or equivalent env docs if Supabase credentials need to be documented

## Implementation Steps

1. Define the backend auth contract before frontend usage begins.
2. Add Supabase configuration and a server-safe client layer.
3. Create the user table model and any required auth-linked relational fields in Supabase Postgres.
4. Implement auth API endpoints or server actions for the flows the frontend will need first.
5. Add session verification and a clear way for protected backend routes to identify the current user.
6. Document the required environment variables and startup assumptions so the frontend can be built against a known backend shape.

## Acceptance Checks

- The backend has a clear Supabase Auth integration path.
- A Postgres-backed user record exists for authenticated users.
- The frontend can be built against a documented auth contract instead of ad hoc assumptions.
- Auth state and user profile state are separated cleanly enough to support future screens.

## Risks

- Mixing identity and app profile data too early could make the schema hard to evolve.
- Building frontend flows before the auth contract exists would create churn.
- If the app later needs non-Supabase providers, the backend abstraction should avoid hard-coding only one flow into the domain layer.

## Blocking Questions

- None for framing. If implementation starts, the next concrete choice is which auth flows come first, usually sign-up/sign-in/session refresh.
