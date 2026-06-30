# Touch Command

User call:

```text
$stride touch <small change>
```

Purpose: make a tiny local change without paying the full frame/carry cost.

Internal flow:

```text
quick probe -> direct edit -> checker if useful -> previewer if user-facing -> handoff
```

Use this for copy tweaks, color changes, spacing fixes, small renames, and other low-risk edits.

Rules:

- Do not write a full frame unless the change turns out to be broader than expected.
- Keep the edit local and small.
- Do not create a worktree by default. Use one only if the repo already depends on isolated worktrees or the change needs isolation.
- Do not spawn the full builder/reviewer pair for a tiny non-UI change unless the scope clearly widened.
- If the change is not user-facing, skip preview and hand off directly after the useful checks.
- If the change is visual, start the preview from the edited checkout and write `.stride/runs/current.md`.
- If the change grows beyond a touch, stop and escalate to `$stride patch` or `$stride spec`.
