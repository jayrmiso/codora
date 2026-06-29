---
name: stride
description: Repo-local Stride Workflow skill for Codex. Use when the user wants the umbrella Stride skill for repo-local workflow context.
---

# Stride Workflow

Use this skill when working in a repository that has Stride Workflow installed and you want the umbrella Stride context.

## When to use

- The user wants the general Stride workflow context.
- The task should use `.stride/` command docs and phases.
- A more specific `stride-*` skill is not the better fit.

## What to do

- Read `.stride/config.md` first.
- Route the request through the matching `.stride/commands/*.md` file.
- Use `.stride/phases/*.md` for deeper workflow behavior.
- Keep worktree, frame, carry, review, and handoff behavior aligned with the installed Stride files.
- Update `.stride/ledger.md` when you learn something durable.

## Core loop

- `touch` for tiny changes.
- `frame` to define the work.
- `carry` to implement in an isolated worktree.
- `land` after manual verification.
- `kit` for UI consistency and reference-driven frontend work.
- `review` and `mend` for review follow-up.
- `status` for a quick snapshot of the current frame and handoff.
