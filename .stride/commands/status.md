# Status Command

User call:

```text
$stride status
```

Purpose: report the current frame, active run, ledger state, changed files, and obvious next action.

Output priority:

1. `.stride/runs/current.md` when it exists, because it contains the latest manual-test URL and handoff card.
2. `.stride/frames/current.md` when it exists.
3. `.stride/ledger.md`.

Use this when the user forgot what changed, which URL to test, which worktree is active, or what command comes next.
