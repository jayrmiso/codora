---
name: stridetouch
description: Stride Workflow skill for tiny local changes. Use when the user wants the fastest safe path for a small tweak that should skip the full patch or impl ceremony.
---

# Stride Touch

Use this skill for tiny local changes that should avoid the heavier patch or impl flow.

## Use when

- The user wants a very small tweak.
- The change is low risk and local.
- The task should stay on the fastest safe path.

## Do

- Keep the scope narrow.
- Prefer a direct edit over a full worktree workflow unless isolation is clearly needed.
- Skip preview when the change is not user-facing.
- If the change is visual, keep the preview and handoff concrete.
- Escalate to `$stride patch` or `$stride spec` if the scope grows.
