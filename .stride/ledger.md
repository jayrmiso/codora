# Stride Ledger

This file records durable project knowledge discovered while using Stride.

## Current State

- Stride has been initialized for this project.

## Decisions

- Stride is a spec-and-impl workflow with explicit worker orchestration.
- Token use should be value-aware, not merely minimized.
- Core lifecycle is `$stride patch` for tiny changes or `$stride spec` -> `$stride impl` -> manual test -> `$stride land` for larger work.
- Frontend systemization uses `$stride kit ui`.

## Open Questions

- Add project-specific conventions as they are discovered.
