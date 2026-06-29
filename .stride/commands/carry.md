# Carry Command

User call:

```text
$stride carry
```

Purpose: implement the approved frame and carry it through verification and review.

Internal flow:

```text
worktree -> load frame -> light probe -> builder -> checker -> debugger if needed -> reviewer -> fixer if needed -> checker again -> previewer if user-facing -> handoff -> ledger -> final report
```

## Rules

- Read `.stride/frames/current.md` before editing.
- Create or reuse the active Stride worktree before editing.
- Re-check relevant files inside the worktree before changing them.
- Make one coherent implementation pass.
- Run the most relevant checks.
- Review the diff for behavior, contracts, states, and missing tests.
- Fix real reviewer findings once.
- For user-facing work, start the preview from the active worktree and verify the URL responds.
- Write `.stride/runs/current.md` with the manual-test URL, what changed, what to check, passed commands, and next command.
- Update `.stride/ledger.md` with durable facts.
