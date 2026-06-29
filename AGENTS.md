<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- stride-workflow:start -->
# Stride Workflow

This repo uses Stride Workflow, an adaptive-depth workflow for Codex.

Before substantial work:

- Read .stride/config.md.
- Route $stride commands through .stride/commands/.
- Use .stride/phases/ for internal phase behavior.
- Announce the active Stride phase before doing it.
- Do not edit application files until the Stride worktree phase is complete.
- Spawn or use the stride-reviewer worker during carry and land before handoff.
- Use .stride/runs/current.md for the latest manual-test handoff when it exists.
- Use .stride/ledger.md for durable project facts.
- Update the ledger when a discovery should survive future turns.

Primary loop: $stride frame -> approval -> $stride carry -> manual test -> $stride land.
Tiny changes can use $stride touch.
UI consistency and screenshot-inspired frontend work can use $stride kit ui.
<!-- stride-workflow:end -->
