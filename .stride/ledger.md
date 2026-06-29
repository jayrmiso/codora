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

## Open Questions

- Add project-specific conventions as they are discovered.
