---
name: strideimpl
description: Stride Workflow skill for implementation work. Use when the spec is approved and the build should happen in an isolated worktree or focused branch.
---

# Stride Impl

Use this skill when implementing approved work.

## Use when

- The spec is approved.
- The task is ready to build.
- The work should happen in an isolated checkout or clean branch.

## Do

- Treat the main chat as orchestrator and use `stridebuilder` as the default editing worker.
- Use the repo-local Stride runner: `node .stride/bin/stride-workflow.mjs`.
- If the Stride runner is missing or fails, stop and ask the user to update Stride. Do not fall back to raw `git worktree` commands.
- Run the Stride runner's `worktree create <task-slug>` before editing when no active Stride worktree exists.
- Run the Stride runner's `worktree assert <active-worktree-path>` before editing.
- Never continue from `main` or `master`.
- Announce the active Stride phase before doing it.
- Treat missing worktree, missing builder worker, or missing reviewer worker as a workflow limitation that must be reported.
- Ask the builder to prefer OOP, SOLID, clean architecture, and clean code when they improve the result, but not to add unnecessary abstraction.
- Apply the agreed scope.
- Keep changes aligned to the spec.
- Preserve a clear path to manual testing.
