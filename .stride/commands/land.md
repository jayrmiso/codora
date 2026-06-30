# Land Command

User call:

```text
$stride land
```

Purpose: publish approved work after manual testing.

Internal flow:

```text
workers(default) -> verify active run -> derive commit subject from spec/run -> check status and scope -> ui-auditor if visual -> reviewer -> commit -> push -> PR -> merge when approved -> cleanup worktree
```

Rules:

- Use the default worker mode before landing so the reviewer worker sees the diff.
- If the change is visual, run `strideuiauditor` on the final diff before committing so visual polish is checked separately from behavior, using Playwright against the live app when possible.
- Read `.stride/runs/current.md` first.
- Use the repo-local Stride runner printed by the active run/worktree status.
- If the Stride runner is missing or fails, stop and ask the user to update Stride. Do not fall back to raw `git worktree` commands.
- Confirm the active worktree and branch with the Stride runner's `worktree status`.
- Run the Stride runner's `worktree assert <active-worktree-path>` before committing or pushing; stop if it fails.
- Announce each phase before starting it: `workers`, `verify run`, `reviewer`, `commit`, `push`, `PR`, `cleanup`.
- The main chat is not allowed to restart implementation during land. If a fix is needed after review, hand it back to a builder worker and return to land only after the scope is complete.
- Spawn or use the `stridereviewer` worker on the final scoped diff before committing. If unavailable, stop and report that Stride cannot complete the default land flow.
- Treat any `[blocking]` reviewer finding as mandatory and do not commit until it is fixed or the user explicitly accepts the risk.
- Derive the commit subject from the approved spec and handoff, using the `.stride/specs/current.md` and `.stride/runs/current.md` context.
- Prefer a conventional commit subject such as `feat: ...`, `fix: ...`, `docs: ...`, or `chore: ...`.
- Keep the commit subject short, specific, and aligned to the approved spec.
- Do not land work that has not reached `Ready for manual test` or `Ready to land`.
- Do not merge unless the user explicitly approved the manual test result or project config allows auto-merge.
- Clean up the Stride worktree only after the merge succeeds or the user asks for cleanup.
- Use the Stride runner's `worktree cleanup <active-worktree-path> --delete-branch` only after the branch has been merged.
