# Stride Ledger

This file records durable project knowledge discovered while using Stride.

## Current State

- Stride has been initialized for this project.

## Decisions

- Stride is a spec-and-impl workflow with explicit worker orchestration.
- Token use should be value-aware, not merely minimized.
- Core lifecycle is `$stride patch` for tiny changes or `$stride spec` -> `$stride impl` -> manual test -> `$stride land` for larger work.
- Frontend systemization uses `$stride kit ui`.

## Implementation Log

- Onboarding language selection now uses a compact selected-summary strip plus a bounded, scrollable proficiency details panel instead of a growing card grid.
- Verified the touched onboarding form with `npx eslint 'src/app/(auth)/onboarding/_components/onboarding-form.tsx'`.
- Manually checked the rendered onboarding route in Chrome at `localhost:3000/onboarding` from the authenticated browser profile.
- Current status: implementation complete in `stride/onboarding-density-fix`, pending land.

## Open Questions

- Add project-specific conventions as they are discovered.
