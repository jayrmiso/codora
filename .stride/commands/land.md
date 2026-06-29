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
- Confirm the active worktree and branch before committing or pushing.
- Announce each phase before starting it: `workers`, `verify run`, `reviewer`, `commit`, `push`, `PR`, `cleanup`.
- Spawn or use the `stride-reviewer` worker on the final scoped diff before committing. If unavailable, say so explicitly and perform the same review locally.
- Derive the commit subject from the approved frame and handoff, using the `.stride/frames/current.md` and `.stride/runs/current.md` context.
- Prefer a conventional commit subject such as `feat: ...`, `fix: ...`, `docs: ...`, or `chore: ...`.
- Keep the commit subject short, specific, and aligned to the approved frame.
- Do not land work that has not reached `Ready for manual test` or `Ready to land`.
- Do not merge unless the user explicitly approved the manual test result or project config allows auto-merge.
- Clean up the Stride worktree only after the merge succeeds or the user asks for cleanup.
