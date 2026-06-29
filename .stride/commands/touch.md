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
- Always create or reuse a Stride worktree, even for tiny changes.
- If the change is visual, start the preview from the edited checkout and write `.stride/runs/current.md`.
