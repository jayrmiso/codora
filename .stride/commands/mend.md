# Mend Command

User call:

```text
$stride mend <symptom>
```

Purpose: debug broken behavior, usually after the user manually tests the active preview.

Internal flow:

```text
read active run -> capture symptom -> reproduce in active worktree -> isolate -> patch -> check -> previewer if user-facing -> handoff -> ledger
```

Rules:

- Read `.stride/runs/current.md` first when it exists.
- Fix the issue in the active worktree, not main.
- Preserve the original frame scope unless the user explicitly expands it.
- Update the handoff card with what changed and what to re-check.
