# Workers Phase

Role: worker-policy chooser.

Used by: `$stride workers`, and internally by `$stride patch`, `$stride impl`, and `$stride land`.

Output: a worker mode and a short rationale in the handoff or run record.

Modes:

- `default`: main chat orchestrates, `stridebuilder` edits for patch/impl, `stridereviewer` reviews
- `balance`: default mode plus `stridelead` recon or one probe/debug helper when discovery helps
- `heavy`: `stridelead` recon plus builder, reviewer, and extra probe/debug support for broader or riskier work

Decision rule:

- choose the smallest mode that can safely finish the task
- prefer `default` for small or low-risk changes
- prefer `balance` for user-facing or multi-file work that needs a little more discovery
- prefer `heavy` for large, risky, or cross-cutting work
- default mode is not "no worker"; it means main chat orchestrates, `stridebuilder` edits for patch/impl, and `stridereviewer` reviews the diff
- `stridelead` is read-only recon, not a writing or planning worker
- every patch, impl, and land handoff should say whether the reviewer worker ran
- every patch and impl handoff should say whether the builder worker ran

Avoid parallel workers unless the task genuinely benefits from the extra token cost.
