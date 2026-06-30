---
name: strideland
description: Stride Workflow skill for landing finished work. Use when the change has been manually verified and should be merged or finalized.
---

# Stride Land

Use this skill when work is ready to land after manual verification.

## Use when

- The change has been tested manually.
- The result matches the spec.
- The work should be merged, finalized, or handed off.

## Do

- Use the default worker mode before landing so the reviewer worker sees the diff.
- Announce the active Stride phase before doing it.
- Use the repo-local Stride runner printed by the active run/worktree status.
- If the Stride runner is missing or fails, stop and ask the user to update Stride. Do not fall back to raw `git worktree` commands.
- Run the Stride runner's `worktree assert <active-worktree-path>` before committing or pushing.
- Check the final diff.
- Preserve any handoff notes.
- Derive the commit subject from the spec and handoff, or use `stride-workflow subject` if available.
- Use a conventional commit subject that matches the approved spec.
- Land only what was actually verified.
