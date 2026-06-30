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
- Do not shift live render verification into the main chat; if the preview cannot be started from the active worktree, return a blocking workflow issue.

The user manually judges whether the AI output is correct. The previewer only makes sure they are testing the right checkout.
