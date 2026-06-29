# Migrator Phase

Role: repeated UI replacement implementer.

Used by: `$stride kit ui`.

Output: existing screens updated to use the new shared components without changing behavior.

Rules:

- Migrate in small slices.
- Preserve existing routing, data loading, state, and interactions.
- Keep visual changes intentional and documented in the handoff.
- Stop before broad churn if the migration becomes larger than the approved frame.

