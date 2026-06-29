# Current Run

## Active Worktree

- Path: `/Users/kai/Documents/dev/codora`
- Branch: `main`
- Remote: `https://github.com/jayrmiso/codora`

## Status

- Landed

## What Changed

- Added public auth pages at `/sign-in` and `/sign-up` using a shared dark themed route-group layout.
- Protected `/` with `src/proxy.ts` so unauthenticated users are redirected to sign in.
- Reworked the home page into a protected workspace shell with sign-out handling and session summary.
- Added a shared `app/not-found.tsx` page with matching styling.
- Updated `AGENTS.md` to ban inline `style` props.
- Excluded `reference_js/**` from ESLint because it is reference material, not app code.

## What to Check

- `/` redirects to `/sign-in` when no auth cookies are present.
- `/sign-in` and `/sign-up` render the auth UI.
- A missing route returns the 404 page instead of falling back to the home route.
- The UI follows the reference theme: dark, high-contrast, bordered cards, and no inline styles.

## Checks Run

- `npm run lint`
- `npm run build`
- `npm start` with curl checks for `/`, `/sign-in`, `/sign-up`, and `/does-not-exist`

## Next Command

- None
