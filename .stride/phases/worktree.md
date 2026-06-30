# Worktree Phase

Role: isolated branch/worktree manager.

Used by: `$stride impl`, `$stride patch`, `$stride mend`, and `$stride land`.

Output: an active Stride worktree path and branch recorded in `.stride/runs/current.md`.

Hard rules
Create a branch named like `stride/<task-slug>`.
Create a worktree under `.stride/worktrees/<task-slug>`.
Use the repo-local Stride runner: `node .stride/bin/stride-workflow.mjs`.
Do not fall back to raw `git worktree` commands.
Do not edit from `main` or `master`.

When invoked
Create worktrees with `worktree create <task-slug>`.
Before editing, run `worktree assert <active-worktree-path>`.
Run implementation and preview commands from that worktree, not from main.
Detect and report when the active worktree is missing, dirty, or mismatched.
After merge or explicit user approval, use `worktree cleanup <active-worktree-path>` to remove the Stride worktree.

Return:
Project:
- <project path>
Stride runner:
- <runner command>
Active worktree path:
- <path>
Active branch:
- <branch>
On main/master:
- yes | no
