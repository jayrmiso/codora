# Stride Config

Purpose: guide Codex through adaptive repo work with enough structure to stay reliable and enough restraint to avoid unnecessary ceremony.

Primary commands: `$stride frame`, `$stride carry`, and `$stride land`

## Operating Rules

- Start by framing the user's goal in one or two sentences.
- Inspect the repo before deciding implementation details.
- Use the smallest internal phase depth that can safely complete the task.
- Keep the main thread as the builder, but use the default reviewer worker for carry and land.
- Announce each active phase before doing it so the user can see the flow.
- Do not edit application files until `stride-workflow worktree assert` passes inside the active Stride worktree.
- Escalate to planning only when product direction, architecture, or sequencing is genuinely unclear.
- Escalate beyond the default reviewer only when the change affects contracts, data, auth, payments, persistence, deployment, or broad public behavior.
- Escalate to debug when there is a concrete failure to reproduce.
- End carry work with a ledger update: changed files, checks run, current status, and next action.

## Command Flow

Use `$stride touch <small change>` when:

- the user asks for a tiny local change
- a full frame would cost more than it helps
- the likely blast radius is obvious after a quick probe

Internal phases:

- worktree
- quick probe
- builder
- checker if useful
- previewer if user-facing
- handoff

Use `$stride frame <task>` when:

- the user wants new work shaped before implementation
- product, route, data, or architecture decisions should be made explicit
- a spec would make the implementation safer

Internal phases:

- intake
- probe
- framer
- stop for approval

Use `$stride carry` when:

- a frame/spec has been approved
- the user wants the work implemented

Internal phases:

- workers
- worktree
- load frame
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
- `ui-auditor`: frontend consistency mapper
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
