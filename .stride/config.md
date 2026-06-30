# Stride Config

Purpose: guide Codex through adaptive repo work with enough structure to stay reliable and enough restraint to avoid unnecessary ceremony.

Primary commands: `$stride touch`, `$stride spec`, `$stride impl`, and `$stride land`

## Operating Rules

- Start by framing the user's goal in one or two sentences.
- Inspect the repo before deciding implementation details.
- Use the smallest internal phase depth that can safely complete the task.
- Treat the main chat as the orchestrator for patch, impl, and land.
- Use `stridebuilder` as the default implementation worker for patch and impl.
- Use `stridereviewer` as the default reviewer worker for patch, impl, and land.
- Use `stridelead` as the read-only recon worker when extra repo facts are needed.
- Use `strideuiauditor` as the read-only visual auditor for user-facing or layout-sensitive work; it should inspect the live UI with Playwright when a preview URL or local route exists.
- The main chat is the brain: it coordinates, decides, and hands off. It does not keep editing once a worker owns the scope.
- Once `stridebuilder` is spawned, the orchestrator stops editing and becomes coordination-only for that scoped change.
- If the orchestrator writes files after spawning `stridebuilder` for the same scope, treat that as a workflow violation and restart the scope through the builder worker.
- If the work naturally splits, use multiple builder or reviewer workers rather than having the main chat take over the write or review path.
- Prefer multiple builders over main-chat edits when that keeps the orchestrator out of the implementation path.
- If the work is visual, run `strideuiauditor` before preview and handoff so the rendered UI is checked separately from source review.
- If the visual auditor cannot run Playwright against the live UI, stop and report a blocking workflow issue rather than moving that check into the main chat.
- If the target route is auth-gated, the previewer must preserve an authenticated Playwright context or the visual audit is blocked.
- If a local env file lives in the parent checkout or repo root instead of the active worktree, the previewer and ui auditor may source it from there for local testing.
- For patch and impl, the `stridebuilder` worker must be spawned before implementation proceeds; if it cannot be spawned, the run is blocked.
- Announce each active phase before doing it so the user can see the flow.
- Use `node .stride/bin/stride-workflow.mjs ...` as the repo-local Stride runner.
- If the Stride runner is missing or fails, stop and ask the user to update Stride. Do not fall back to raw `git worktree` commands.
- Do not edit application files until the Stride runner's `worktree assert` passes for the active Stride worktree.
- Escalate to planning only when product direction, architecture, or sequencing is genuinely unclear.
- Escalate beyond the default reviewer only when the change affects contracts, data, auth, payments, persistence, deployment, broad public behavior, visual polish, or when a recon pass would materially reduce uncertainty.
- Escalate to debug when there is a concrete failure to reproduce.
- End impl work with a ledger update: changed files, checks run, current status, and next action.

## Command Flow

Use `$stride touch <small change>` when:

- the user asks for a tiny local change
- a full spec would cost more than it helps
- the likely blast radius is obvious after a quick probe
- the change is non-UI or does not need a live preview
- you want the fastest safe path for a one-off tweak

Internal phases:

- quick probe
- direct edit
- checker if useful
- previewer if user-facing
- handoff

Use `$stride patch <small change>` when:

- the user asks for a tiny local change
- a full spec would cost more than it helps
- the likely blast radius is obvious after a quick probe
- the change should still use the normal worktree, builder worker, checks, reviewer worker, preview, handoff, and ledger flow

Internal phases:

- workers
- worktree
- capture patch request
- light probe
- builder
- checker
- debugger if needed
- reviewer
- fixer if needed
- checker again
- previewer if user-facing
- handoff
- ledger
- final report

Use `$stride spec <task>` when:

- the user wants new work shaped before implementation
- product, route, data, or architecture decisions should be made explicit
- a spec would make the implementation safer

Internal phases:

- intake
- probe
- framer
- stop for approval

Use `$stride impl` when:

- a spec has been approved
- the user wants the work implemented

Internal phases:

- workers
- worktree
- load spec
- light probe
- builder
- checker
- debugger if needed
- reviewer
- fixer if needed
- checker again
- previewer if user-facing
- handoff
- ledger
- final report

Use `$stride land` when:

- the user manually tested the active worktree and approved it
- the work is ready to commit, push, PR, merge, and clean up

Internal phases:

- workers
- verify active run
- check status and scope
- commit if needed
- push branch
- create PR
- merge only when explicitly approved or configured
- clean up worktree after merge

Use `$stride kit ui` when:

- the frontend is becoming inconsistent
- repeated UI should become shared components
- the user provides screenshots or references to imitate
- a feature needs a coherent component/style system before more pages are built

Internal phases:

- worktree
- ui-auditor
- reference-reader if screenshots or links are provided
- kit-designer
- builder
- migrator if existing UI should be updated
- checker
- previewer
- handoff

Use `$stride review` when:

- the user asks for review without implementation

Use `$stride mend` when:

- the user reports an error, failing test, broken UI, or production issue

## Phase Map

- `intake`: request interpreter
- `probe`: repo explorer
- `framer`: spec writer
- `builder`: implementation engineer
- `checker`: verification runner
- `debugger`: failure investigator
- `reviewer`: behavioral reviewer
- `fixer`: review-response implementer
- `ui-auditor`: frontend consistency mapper and visual quality checker
- `reference-reader`: screenshot/reference interpreter
- `kit-designer`: component and token designer
- `migrator`: repeated UI replacement implementer
- `worktree`: isolated branch/worktree manager
- `previewer`: manual-test server manager
- `handoff`: manual-test guide
- `ledger`: durable memory keeper

## Token Discipline

- Read fewer files, but read the right files.
- Keep reusable facts in `.stride/ledger.md`.
- Do not repeat long reasoning in final answers.
- Do not run extra review passes unless a specific risk remains.
- Prefer targeted checks before full builds, unless the repo convention says otherwise.
