# Current Run

## Active Worktree

- Path: `/Users/kai/Documents/dev/codora`
- Branch: `main`
- Remote: `https://github.com/jayrmiso/codora`

## Status

- Landed

## What Changed

- Added `/home` as the authenticated landing page and made `/` redirect there.
- Fixed the auth loop by forwarding browser cookies to the session API from the home page.
- Added a GitHub login provider entry that redirects through Supabase OAuth.
- Updated the auth page copy so it describes Codora instead of auth plumbing.
- Added a sign-in fragment bridge that consumes Supabase `#access_token=...` returns and persists them through `/api/auth/complete-oauth`.
- Added repo-local product docs under `docs/` from the four source PDFs.

## What to Check

- `/` redirects to `/sign-in` when no auth cookies are present.
- `/home` renders the protected workspace when authenticated.
- Sign-in with email/password lands on `/home` instead of looping back to `/`.
- The GitHub button redirects to Supabase OAuth and the `/sign-in` fragment is consumed automatically.
- The auth page copy mentions Codora and the product, not generic auth text.
- The GitHub trigger no longer emits RSC fetch warnings.

## Checks Run

- `npm run lint`
- `npm run build`
- `npm start` with curl checks for `/`, `/home`, `/sign-in`, and `/api/auth/github?next=/home`

## Next Command

- None
