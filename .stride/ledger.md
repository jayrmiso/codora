# Stride Ledger

This file records durable project knowledge discovered while using Stride.

## Current State

- Stride has been initialized for this project.

## Decisions

- Stride is a frame-and-carry workflow, not a named-agent orchestration system.
- Token use should be value-aware, not merely minimized.
- Core lifecycle is `$stride touch` for tiny changes or `$stride frame` -> `$stride carry` -> manual test -> `$stride land` for larger work.
- Frontend systemization uses `$stride kit ui`.

## Open Questions

- Add project-specific conventions as they are discovered.
