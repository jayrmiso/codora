# Workers Phase

Role: worker-policy chooser.

Used by: `$stride workers`, and internally by `$stride carry`, `$stride touch`, and `$stride land` when a task needs a worker strategy.

Output: a worker mode and a short rationale in the handoff or run record.

Modes:

- `default`: main thread builds, one reviewer worker checks the diff
- `balance`: default mode plus one probe/debug helper when discovery helps
- `heavy`: reviewer plus extra probe/debug support for broader or riskier work

Decision rule:

- choose the smallest mode that can safely finish the task
- prefer `default` for small or low-risk changes
- prefer `balance` for user-facing or multi-file work that needs a little more discovery
- prefer `heavy` for large, risky, or cross-cutting work

Avoid parallel workers unless the task genuinely benefits from the extra token cost.
