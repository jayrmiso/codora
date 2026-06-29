---
name: stride-touch
description: Stride Workflow skill for tiny, low-risk changes. Use when the user wants a quick fix or a small edit with minimal ceremony.
---

# Stride Touch

Use this skill for tiny changes that do not need a full frame-and-carry flow.

## Use when

- The user wants a small, low-risk tweak.
- The change is simple enough to avoid a larger spec.
- The task should stay lightweight and local.

## Do

- Keep the scope narrow.
- Make the smallest safe change.
- Run `stride-workflow worktree create <task-slug>` even when the change is tiny.
- Run `stride-workflow worktree assert` from the active worktree before editing.
- Announce each Stride phase before doing it.
- Stop and report a workflow error instead of editing from `main` or `master`.
- Update the ledger only if the result matters later.
- Avoid spinning up a heavier workflow unless needed.
