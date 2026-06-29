# Frame: Auth Pages and Route Protection

## Goal

Create public sign-in and sign-up pages, protect the home route for authenticated users, and add a shared 404 page that fits the repo's dark reference theme.

## Repo Facts

- The app uses the Next.js App Router under `src/app`.
- Auth APIs already exist under `src/app/api/auth/*` and manage Supabase cookies.
- The protected workspace lives at `/`.
- Route groups are available, so auth-only pages can live under `src/app/(auth)/...` without changing their URLs.
- `src/proxy.ts` is the Next 16 request gate for auth redirects.
- `reference_js` is sample UI material only and should not be treated as linted app code.

## Affected Areas

- `src/app/(auth)/layout.tsx`
- `src/app/(auth)/_components/auth-form.tsx`
- `src/app/(auth)/sign-in/page.tsx`
- `src/app/(auth)/sign-up/page.tsx`
- `src/app/page.tsx`
- `src/app/not-found.tsx`
- `src/app/_components/sign-out-button.tsx`
- `src/proxy.ts`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `AGENTS.md`
- `eslint.config.mjs`

## Implementation Notes

- Keep the auth UI class-based with no inline `style` props.
- Use the cookie-backed auth APIs that already exist for sign-in, sign-up, and sign-out.
- Redirect unauthenticated users away from `/` and authenticated users away from `/sign-in` and `/sign-up`.
- Render the protected home screen with a dark, high-contrast shell that matches the reference theme.
- Use `app/not-found.tsx` for the shared 404 experience.

## Acceptance Checks

- Visiting `/` without cookies redirects to `/sign-in`.
- Visiting `/sign-in` and `/sign-up` renders the auth pages.
- Visiting an unknown route renders the 404 page with the app shell styling.
- `npm run lint` passes.
- `npm run build` passes.

## Risks

- Proxy-based auth is optimistic and only checks cookies; the session API still needs to remain the source of truth.
- The reference sample folder must stay ignored by lint to avoid false failures.
