# Workers Command

User call:

```text
$stride workers
```

Purpose: choose the lightest worker strategy that fits the task, so token use stays sane while work still gets the right support.

Internal flow:

```text
frame/run probe -> worker policy -> minimum viable workers -> carry/review/land
```

Use this when:

- you want Stride to stay token-aware
- the task needs more than a single direct pass
- you want to know whether to use default, balance, or heavy mode

Modes:

- `default`: main thread builds, plus one reviewer worker for the diff
- `balance`: default mode plus one extra probe/debug helper when the task needs more discovery
- `heavy`: main thread plus reviewer and extra probe/debug support for broad, risky, or cross-cutting changes

Rules:

- Start with the smallest mode that can safely finish the work.
- Do not add more than the reviewer worker for tiny changes.
- Escalate from `default` to `balance` or `heavy` only when the task justifies the token cost.
- Record the chosen mode in the handoff when it matters to the next step.
