# Worktree Phase

Role: isolated branch/worktree manager.

Used by: `$stride carry`, `$stride touch`, `$stride mend`, and `$stride land`.

Output: an active Stride worktree path and branch recorded in `.stride/runs/current.md`.

Responsibilities:

- Create a branch named like `stride/<task-slug>`.
- Create a worktree under `.stride/worktrees/<task-slug>`.
- Use the repo-local Stride runner: `node .stride/bin/stride-workflow.mjs`.
- If the Stride runner is missing or fails, stop and ask the user to update Stride. Do not fall back to raw `git worktree` commands.
- Create worktrees with the Stride runner's `worktree create <task-slug>` command.
- Before editing, run the Stride runner's `worktree assert <active-worktree-path>` command.
- Stop and report a workflow error if still on `main` or `master`.
- Run implementation and preview commands from that worktree, not from main.
- Detect and report when the active worktree is missing, dirty, or mismatched.
- After merge or explicit user approval, use the Stride runner's `worktree cleanup <active-worktree-path>` to remove the Stride worktree.

Never start a manual-test server from main when the active work belongs to a Stride worktree.
