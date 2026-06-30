# Stride Ledger

This file records durable project knowledge discovered while using Stride.

## Current State

- Stride has been initialized for this project.
- 2026-06-30 11:51:31 AEST: onboarding density patch updated `src/app/(auth)/onboarding/_components/onboarding-form.tsx` and `src/app/(auth)/layout.tsx`; removed redundant selected-language summary UI, compacted per-language rows, widened the onboarding shell; targeted check passed with `../../../node_modules/.bin/eslint 'src/app/(auth)/onboarding/_components/onboarding-form.tsx' 'src/app/(auth)/layout.tsx'`; next action is visual/manual verification on `/onboarding`.

## Decisions

- Stride is a spec-and-impl workflow with explicit worker orchestration.
- Token use should be value-aware, not merely minimized.
- Core lifecycle is `$stride patch` for tiny changes or `$stride spec` -> `$stride impl` -> manual test -> `$stride land` for larger work.
- Frontend systemization uses `$stride kit ui`.

## Open Questions

- Add project-specific conventions as they are discovered.
