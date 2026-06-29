# Stride Ledger

This file records durable project knowledge discovered while using Stride.

## Current State

- Stride has been initialized for this project.

## Decisions

- Stride is a frame-and-carry workflow, not a named-agent orchestration system.
- Token use should be value-aware, not merely minimized.
- Core lifecycle is `$stride touch` for tiny changes or `$stride frame` -> `$stride carry` -> manual test -> `$stride land` for larger work.
- Frontend systemization uses `$stride kit ui`.
- `/onboarding` uses its own single-card shell instead of the split auth hero layout, while `/sign-in` and `/sign-up` keep the two-column auth shell.
- Onboarding now collects multiple programming languages plus a proficiency level for each selected language.
- Proficiency is stored per programming language via `profiles.language_proficiency_levels` and the normalized `profile_language_preferences` table, with `programming_languages` as the canonical language catalog.
- Python is still the only active problem runtime, but onboarding already seeds additional languages for future support.

## Open Questions

- Add project-specific conventions as they are discovered.
