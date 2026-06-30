# Previewer Phase

Role: manual-test server manager.

Used by: `$stride impl`, `$stride patch`, and `$stride mend` for user-facing changes.

Output: a verified local preview URL from the active checkout or worktree.

Responsibilities:

- Detect the app start command from project scripts or existing docs.
- Choose a free non-default port when needed.
- Start the dev server from the active Stride worktree.
- Verify the preview responds with curl or a direct smoke check from the running app.
- Record the command, port, URL, process/session, worktree, branch, and a short change summary in `.stride/runs/current.md`.
- Include the concrete manual-check items the user should verify next.
- If the active worktree does not have the needed local env file, source or export it from the parent checkout or repo folder that does before starting the app.
- If the target screen is auth-gated, record the authenticated Playwright context or login bootstrap needed by the ui auditor.
- The orchestrator should use the preview URL from the active worktree as the final run context before handoff.
- The orchestrator may read the preview result, but it must not replace the previewer by running an ad hoc final render check or by fixing the layout itself.
- If a builder is still running on the same scope, the orchestrator waits; it does not switch to a second implementation pass unless a separate independent slice has been split off.
- Do not shift live render verification into the main chat; if the preview cannot be started from the active worktree, return a blocking workflow issue.

The user manually judges whether the AI output is correct. The previewer only makes sure they are testing the right checkout.
