# Patch Command

User call:

```text
$stride patch <small change>
```

Purpose: orchestrate a small no-spec change through builder work, verification, reviewer work, and handoff.

Internal flow:

```text
workers(default: stridebuilder + stridereviewer) -> worktree -> capture patch request -> light probe -> builder worker -> checker -> debugger if needed -> ui-auditor if visual -> reviewer worker -> fixer via builder if needed -> checker again -> previewer if user-facing -> handoff -> ledger -> final report
```

Use this for copy tweaks, color changes, spacing fixes, small renames, and other low-risk edits.

Rules:

- Do not write a full spec unless the change turns out to be broader than expected.
- Use the user request as the approved scope. If the scope is unclear or broader than a patch, stop and ask for `$stride spec`.
- Choose the default worker mode before editing unless the task clearly needs balance or heavy mode.
- The main chat is the orchestrator. Do not edit application files directly in the main chat during patch.
- Once `stridebuilder` is spawned, the main chat must stop editing and only coordinate, verify, and hand off. The builder worker owns all file writes for the scoped change.
- Default worker mode means `stridebuilder` edits and `stridereviewer` reviews.
- Keep the edit local.
- Use the repo-local Stride runner: `node .stride/bin/stride-workflow.mjs`.
- If the Stride runner is missing or fails, stop and ask the user to update Stride. Do not fall back to raw `git worktree` commands.
- Always create or reuse a Stride worktree with `node .stride/bin/stride-workflow.mjs worktree create <task-slug>`, even for tiny changes.
- Continue all repo reads, edits, checks, and preview commands from the printed active worktree path.
- Run the printed Stride runner's `worktree assert <active-worktree-path>` before editing; stop if it fails.
- Announce each phase before starting it: `workers`, `worktree`, `probe`, `builder`, `checker`, `reviewer`, `handoff`.
- Stop and report a workflow error instead of editing from `main` or `master`.
- Prepare exact builder instructions from the patch request: active worktree, branch, scope, files/areas, implementation steps, checks, and handoff expectations.
- Spawn or use the `stridebuilder` worker to make the implementation changes inside the active worktree.
- If the builder result is incomplete or stalls, do not take over the edit in the main chat. Either ask the builder for a blocking report or spawn a fresh builder worker for the same scope if the chosen mode justifies it.
- If the builder worker is unavailable, stop and report that Stride cannot continue the default patch flow. Do not silently edit in the main chat.
- Run the most relevant checks.
- If the change is visual or user-facing, spawn or use `strideuiauditor` before reviewer and preview so the UI quality is checked separately from behavior, using Playwright against the live app when possible.
- Spawn or use the `stridereviewer` worker to review the scoped diff for behavior, contracts, states, and missing tests.
- If the reviewer result is incomplete or stalls, do not replace the review with a main-chat pass. Either ask the reviewer for a blocking report or spawn a fresh reviewer worker for the same scope if the chosen mode justifies it.
- If the reviewer worker is unavailable, stop and report that Stride cannot complete the default patch flow.
- Treat any `[blocking]` reviewer finding as mandatory: pass it back to `stridebuilder` once, re-run relevant checks, and re-review.
- If the change is visual, start the preview from the edited checkout and write `.stride/runs/current.md`.
- Write `.stride/runs/current.md` with the manual-test URL, what changed, what to check, passed commands, reviewer result, and next command.
- Update `.stride/ledger.md` with durable facts.
