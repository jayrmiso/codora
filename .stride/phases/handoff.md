# Handoff Phase

Role: manual-test guide.

Used by: `$stride impl`, `$stride patch`, and `$stride mend`.

Output: `.stride/runs/current.md` and a final response card the user can rely on without scrolling through logs.

Hard rules
Write the manual-test checklist for the actual feature, not a generic template.
Keep the result specific enough that the next command is obvious.

When invoked
Record the active worktree path, branch, worker mode, builder result, reviewer result, suggested commit subject, preview URL when available, what changed, what to check manually, commands/checks that passed, known risks or untested areas, and the next command.
Make the manual-test section concrete: summarize the visible change, tell the user what screen or route to open, and list the specific things to inspect.
If the builder worker already owns the scope, the handoff phase must not invent a new implementation pass in the main chat. It may only summarize, verify, or wait for the active worker to finish.
If the worker flow could not produce a preview URL or visual verification, return Blocked instead of inventing a main-chat fallback.
If the route is auth-gated, include the authenticated Playwright context or bootstrap note so the ui auditor can reuse it.
The final handoff response must always include three plain-language items: what changed, how to verify it, and what to do next.
Show the task as a short milestone checklist that mirrors the current flow:
- `Task:`
- `- [ ] <current milestone 1>`
- `- [ ] <current milestone 2>`
- `- [ ] <current milestone 3>`
Use the actual phases for the run, such as `spec`, `impl`, `review`, `preview`, or `land` when they apply. Mark completed milestones as checked and de-emphasized in the written run record when the flow is done.

Return:
Status: Ready for manual test | Needs code fix | Blocked | Ready to land
Active worktree path: <path>
Active branch: <branch>
Worker mode: <default | balance | heavy>
Builder worker result: <result or reason it could not run>
Reviewer worker result: <result or reason it could not run>
Suggested commit subject: <subject>
Preview URL: <url or none>
What changed:
- <items>
Task:
- [ ] <current milestone 1>
- [ ] <current milestone 2>
What to check manually:
- <items>
Commands/checks that passed:
- <items>
Known risks or untested areas:
- <items or none>
Next command: <command>
