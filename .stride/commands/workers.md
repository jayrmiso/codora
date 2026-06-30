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

- `default`: main chat orchestrates, one `stridebuilder` edits, one `stridereviewer` reviews
- `balance`: default mode plus `stridelead` recon or one probe/debug helper when the task needs more discovery; may spawn additional builder or reviewer workers for separate scoped subparts if that reduces risk
- `heavy`: `stridelead` recon plus multiple builders, multiple reviewers, and extra probe/debug support for broad, risky, or cross-cutting changes

Rules:

- Start with the smallest mode that can safely finish the work.
- Patch, impl, and land should use default mode unless a stronger mode is justified.
- Default patch and impl require at least one `stridebuilder` for edits and at least one `stridereviewer` for the scoped diff.
- Default land requires at least one `stridereviewer` for the final scoped diff.
- Default patch and impl must actually spawn the `stridebuilder` worker before implementation proceeds. If the builder cannot be spawned, stop and report the workflow limitation instead of continuing in the main chat.
- If a required worker is unavailable, stop and report the workflow limitation. Do not silently do the worker's job in the main chat.
- If the worker ceiling is hit, wait for the active worker to finish or close an idle worker. Do not continue the task in the main chat while no worker slot is available.
- Do not add `stridelead` for small changes unless the repo facts are unclear or risky.
- Do not spawn extra builders or reviewers in default mode unless the task is clearly split into independent scoped parts.
- Escalate from `default` to `balance` or `heavy` only when the task justifies the token cost.
- Record the chosen mode in the handoff when it matters to the next step.
