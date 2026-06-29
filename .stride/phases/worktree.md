# Worktree Phase

Role: isolated branch/worktree manager.

Used by: `$stride carry`, `$stride touch`, `$stride mend`, and `$stride land`.

Output: an active Stride worktree path and branch recorded in `.stride/runs/current.md`.

Responsibilities:

- Create a branch named like `stride/<task-slug>`.
- Create a worktree under `.stride/worktrees/<task-slug>`.
- Prefer `stride-workflow worktree create <task-slug>` instead of raw `git worktree add`.
- Before editing, run `stride-workflow worktree assert` from the active worktree.
- Stop and report a workflow error if still on `main` or `master`.
- Run implementation and preview commands from that worktree, not from main.
- Detect and report when the active worktree is missing, dirty, or mismatched.
- After merge or explicit user approval, use `stride-workflow worktree cleanup <active-worktree-path>` to remove the Stride worktree.

Never start a manual-test server from main when the active work belongs to a Stride worktree.
