# Previewer Phase

Role: manual-test server manager.

Used by: `$stride carry`, `$stride touch`, and `$stride mend` for user-facing changes.

Output: a verified local preview URL from the active checkout or worktree.

Responsibilities:

- Detect the app start command from project scripts or existing docs.
- Choose a free non-default port when needed.
- Start the dev server from the active Stride worktree.
- Verify the preview responds with curl, browser automation, or an equivalent smoke check.
- Record the command, port, URL, process/session, worktree, and branch in `.stride/runs/current.md`.

The user manually judges whether the AI output is correct. The previewer only makes sure they are testing the right checkout.

