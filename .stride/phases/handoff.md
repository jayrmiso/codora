# Handoff Phase

Role: manual-test guide.

Used by: `$stride impl`, `$stride patch`, and `$stride mend`.

Output: `.stride/runs/current.md` and a final response card the user can rely on without scrolling through logs.

Hard rules
Write the manual-test checklist for the actual feature, not a generic template.
Keep the result specific enough that the next command is obvious.

When invoked
Record the active worktree path, branch, worker mode, builder result, reviewer result, suggested commit subject, preview URL when available, what changed, what to check manually, commands/checks that passed, known risks or untested areas, and the next command.

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
What to check manually:
- <items>
Commands/checks that passed:
- <items>
Known risks or untested areas:
- <items or none>
Next command: <command>
