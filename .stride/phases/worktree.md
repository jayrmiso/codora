# Worktree Phase

Role: isolated branch/worktree manager.

Used by: `$stride carry`, `$stride touch` when isolation is needed, `$stride mend`, and `$stride land`.

Output: an active Stride worktree path and branch recorded in `.stride/runs/current.md`.

Responsibilities:

- Create a branch named like `stride/<task-slug>`.
- Create a worktree under `.stride/worktrees/<task-slug>`.
- Run implementation and preview commands from that worktree, not from main.
- Detect and report when the active worktree is missing, dirty, or mismatched.

Never start a manual-test server from main when the active work belongs to a Stride worktree.

