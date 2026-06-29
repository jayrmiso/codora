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
- Use the repo-local Stride runner: `node .stride/bin/stride-workflow.mjs`.
- If the Stride runner is missing or fails, stop and ask the user to update Stride. Do not fall back to raw `git worktree` commands.
- Always create or reuse a Stride worktree with `node .stride/bin/stride-workflow.mjs worktree create <task-slug>`, even for tiny changes.
- Continue all repo reads, edits, checks, and preview commands from the printed active worktree path.
- Run the printed Stride runner's `worktree assert <active-worktree-path>` before editing; stop if it fails.
- Announce each phase before starting it: `worktree`, `probe`, `builder`, `checker`, `previewer`, `handoff`.
- Stop and report a workflow error instead of editing from `main` or `master`.
- If the change is visual, start the preview from the edited checkout and write `.stride/runs/current.md`.
