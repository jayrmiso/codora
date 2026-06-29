# Land Command

User call:

```text
$stride land
```

Purpose: publish approved work after manual testing.

Internal flow:

```text
verify active run -> check status and scope -> commit -> push -> PR -> merge when approved -> cleanup worktree
```

Rules:

- Read `.stride/runs/current.md` first.
- Confirm the active worktree and branch before committing or pushing.
- Do not land work that has not reached `Ready for manual test` or `Ready to land`.
- Do not merge unless the user explicitly approved the manual test result or project config allows auto-merge.
- Clean up the Stride worktree only after the merge succeeds or the user asks for cleanup.

