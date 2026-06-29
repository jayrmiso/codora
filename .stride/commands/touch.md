# Touch Command

User call:

```text
$stride touch <small change>
```

Purpose: make a tiny change without paying the full frame/carry cost.

Internal flow:

```text
worktree -> quick probe -> builder -> checker if useful -> previewer if user-facing -> handoff
```

Use this for copy tweaks, color changes, spacing fixes, small renames, and other low-risk edits.

Rules:

- Do not write a full frame unless the change turns out to be broader than expected.
- Keep the edit local.
- Always create or reuse a Stride worktree with `stride-workflow worktree create <task-slug>`, even for tiny changes.
- Continue all repo reads, edits, checks, and preview commands from the printed active worktree path.
- Run `stride-workflow worktree assert` from the active worktree before editing; stop if it fails.
- Announce each phase before starting it: `worktree`, `probe`, `builder`, `checker`, `previewer`, `handoff`.
- Stop and report a workflow error instead of editing from `main` or `master`.
- If the change is visual, start the preview from the edited checkout and write `.stride/runs/current.md`.
