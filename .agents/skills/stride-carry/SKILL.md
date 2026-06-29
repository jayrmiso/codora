---
name: stride-carry
description: Stride Workflow skill for implementation work. Use when the frame is approved and the build should happen in an isolated worktree or focused branch.
---

# Stride Carry

Use this skill when implementing approved work.

## Use when

- The frame is approved.
- The task is ready to build.
- The work should happen in an isolated checkout or clean branch.

## Do

- Use the reviewer worker as the default worker mode before editing.
- Run `stride-workflow worktree create <task-slug>` before editing when no active Stride worktree exists.
- Run `stride-workflow worktree assert` from the active worktree before editing.
- Never continue from `main` or `master`.
- Announce the active Stride phase before doing it.
- Treat missing worktree or missing reviewer worker as a workflow limitation that must be reported.
- Apply the agreed scope.
- Keep changes aligned to the frame.
- Preserve a clear path to manual testing.
