# Carry Command

User call:

```text
$stride carry
```

Purpose: implement the approved frame and carry it through verification and review.

Internal flow:

```text
workers(default) -> worktree -> load frame -> light probe -> builder -> checker -> debugger if needed -> reviewer -> fixer if needed -> checker again -> previewer if user-facing -> handoff -> ledger -> final report
```

## Rules

- Read `.stride/frames/current.md` before editing.
- Choose the default worker mode before editing unless the task clearly needs balance or heavy mode.
- Create or reuse the active Stride worktree before editing.
- Never edit from `main` when a Stride worktree is available.
- Announce each phase before starting it: `workers`, `worktree`, `probe`, `builder`, `checker`, `reviewer`, `handoff`.
- Re-check relevant files inside the worktree before changing them.
- Make one coherent implementation pass.
- Run the most relevant checks.
- Spawn or use the `stride-reviewer` worker to review the scoped diff for behavior, contracts, states, and missing tests.
- If the reviewer worker is unavailable, say that explicitly and perform a local review with the same output shape.
- Fix real reviewer findings once.
- For user-facing work, start the preview from the active worktree and verify the URL responds.
- Write `.stride/runs/current.md` with the manual-test URL, what changed, what to check, passed commands, and next command.
- Update `.stride/ledger.md` with durable facts.
