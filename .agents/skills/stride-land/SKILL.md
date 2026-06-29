---
name: stride-land
description: Stride Workflow skill for landing finished work. Use when the change has been manually verified and should be merged or finalized.
---

# Stride Land

Use this skill when work is ready to land after manual verification.

## Use when

- The change has been tested manually.
- The result matches the frame.
- The work should be merged, finalized, or handed off.

## Do

- Check the final diff.
- Preserve any handoff notes.
- Derive the commit subject from the frame and handoff, or use `stride-workflow subject` if available.
- Use a conventional commit subject that matches the approved frame.
- Land only what was actually verified.
