# Land Command

User call:

```text
$stride land
```

Purpose: publish approved work after manual testing.

Internal flow:

```text
workers(default) -> verify active run -> derive commit subject from frame/run -> check status and scope -> commit -> push -> PR -> merge when approved -> cleanup worktree
```

Rules:

- Use the default worker mode before landing so the reviewer worker sees the diff.
- Read `.stride/runs/current.md` first.
- Confirm the active worktree and branch with `stride-workflow worktree status`.
- Run `stride-workflow worktree assert <active-worktree-path>` before committing or pushing; stop if it fails.
- Announce each phase before starting it: `workers`, `verify run`, `reviewer`, `commit`, `push`, `PR`, `cleanup`.
- Spawn or use the `stride-reviewer` worker on the final scoped diff before committing. If unavailable, say so explicitly and perform the same review locally.
- Treat any `[blocking]` reviewer finding as mandatory and do not commit until it is fixed or the user explicitly accepts the risk.
- Derive the commit subject from the approved frame and handoff, using the `.stride/frames/current.md` and `.stride/runs/current.md` context.
- Prefer a conventional commit subject such as `feat: ...`, `fix: ...`, `docs: ...`, or `chore: ...`.
- Keep the commit subject short, specific, and aligned to the approved frame.
- Do not land work that has not reached `Ready for manual test` or `Ready to land`.
- Do not merge unless the user explicitly approved the manual test result or project config allows auto-merge.
- Clean up the Stride worktree only after the merge succeeds or the user asks for cleanup.
- Use `stride-workflow worktree cleanup <active-worktree-path> --delete-branch` only after the branch has been merged.
