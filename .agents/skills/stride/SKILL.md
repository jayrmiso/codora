---
name: stride
description: Repo-local Stride Workflow skill for Codex. Use when the user wants the umbrella Stride skill for repo-local workflow context.
---

# Stride Workflow

Use this skill when working in a repository that has Stride Workflow installed and you want the umbrella Stride context.

## When to use

- The user wants the general Stride workflow context.
- The task should use `.stride/` command docs and phases.
- A more specific Stride skill is not the better fit.

## What to do

- Read `.stride/config.md` first.
- Route the request through the matching `.stride/commands/*.md` file.
- Use `.stride/phases/*.md` for deeper workflow behavior.
- Use `.stride/phases/workers.md` before patch, impl, and land so the default builder/reviewer worker flow is included.
- Use `.stride/phases/worktree.md` before editing so work happens in the isolated checkout, not main.
- Use the repo-local Stride runner: `node .stride/bin/stride-workflow.mjs`.
- If the Stride runner is missing or fails, stop and ask the user to update Stride. Do not fall back to raw `git worktree` commands.
- Run the Stride runner's `worktree create <task-slug>` before implementation when no active Stride worktree exists.
- Run the Stride runner's `worktree assert <active-worktree-path>` before editing; stop if it fails.
- Announce each Stride phase before doing it.
- For patch and impl, spawn or use `stridebuilder` to edit inside the active worktree.
- Once `stridebuilder` is spawned, stop editing in the main chat and use the main chat only to coordinate, verify, and hand off.
- Treat the main chat as the brain, not the hands: if the scope can be split across multiple builders to keep the orchestrator out of edits, do that.
- For patch, impl, and land, spawn or use `stridereviewer` against the scoped diff before handoff.
- When the change is user-facing or layout-sensitive, also use `strideuiauditor` to inspect the live UI with Playwright.
- If the visual auditor cannot run Playwright, treat that as a blocked workflow state instead of moving the render check into the main chat.
- Never finish patch or impl without a handoff card that says what changed, what the user should verify in the running app, and the next command.
- Keep worktree, spec, impl, review, and handoff behavior aligned with the installed Stride files.
- Update `.stride/ledger.md` when you learn something durable.

## Core loop

- `patch` for tiny changes.
- `spec` to define the work.
- `patch` skips the spec step only; it still uses worktree, builder, checks, reviewer, preview when useful, and handoff.
- `impl` implements an approved spec in the same execution/review flow.
- `land` after manual verification.
- `kit` for UI consistency and reference-driven frontend work.
- `review` and `mend` for review follow-up.
- `status` for a quick snapshot of the current spec and handoff.
