---
name: stride
description: Repo-local Stride Workflow skill for Codex. Use for $stride touch, frame, carry, land, kit, review, mend, and status inside projects that have .stride files installed.
---

# Stride Workflow

Use this skill when working in a repository that has Stride Workflow installed.

## When to use

- The user asks for `\$stride touch`, `\$stride frame`, `\$stride carry`, `\$stride land`, `\$stride kit`, `\$stride review`, `\$stride mend`, or `\$stride status`.
- The user wants to follow the Stride workflow inside a repo.
- The task should use `.stride/` command docs and phases.

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
