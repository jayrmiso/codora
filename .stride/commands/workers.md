# Workers Command

User call:

```text
$stride workers
```

Purpose: choose the lightest worker strategy that fits the task, so token use stays sane while work still gets the right support.

Internal flow:

```text
spec/run probe -> worker policy -> minimum viable workers -> builder/reviewer/land
```

Use this when:

- you want Stride to stay token-aware
- the task needs more than a single direct pass
- you want to know whether to use default, balance, or heavy mode

Modes:

- `default`: main chat orchestrates, `stridebuilder` edits, `stridereviewer` reviews
- `balance`: default mode plus `stridelead` recon or one probe/debug helper when the task needs more discovery
- `heavy`: `stridelead` recon plus builder, reviewer, and extra probe/debug support for broad, risky, or cross-cutting changes

Rules:

- Start with the smallest mode that can safely finish the work.
- Patch, impl, and land should use default mode unless a stronger mode is justified.
- Default patch and impl require `stridebuilder` for edits and `stridereviewer` for the scoped diff.
- Default land requires `stridereviewer` for the final scoped diff.
- If a required worker is unavailable, stop and report the workflow limitation. Do not silently do the worker's job in the main chat.
- Do not add `stridelead` for small changes unless the repo facts are unclear or risky.
- Escalate from `default` to `balance` or `heavy` only when the task justifies the token cost.
- Record the chosen mode in the handoff when it matters to the next step.
