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
- Use `node .stride/bin/stride-workflow.mjs ...` as the repo-local Stride runner.
- If the Stride runner is missing or fails, stop and ask the user to update Stride. Do not fall back to raw git worktree commands.
- Do not edit application files until the Stride runner's `worktree assert` passes for the active Stride worktree.
- Treat the main chat as orchestrator for patch, impl, and land.
- If the main chat has spawned `stridebuilder` for a scoped change, it must stop writing files for that scope and only coordinate, verify, and hand off.
- Spawn or use stridebuilder for patch and impl implementation work.
- Use stridelead as the read-only recon worker when extra repo facts are needed.
- Use strideuiauditor as the read-only visual auditor for user-facing or layout-sensitive work before preview and handoff. It should inspect the live UI with Playwright when a route is available.
- Spawn or use stridereviewer during patch, impl, and land before handoff.
- If a builder or reviewer result stalls, do not take over the edit or review in the main chat; either ask for a blocking report or spawn another worker when the chosen mode justifies it.
- Use .stride/runs/current.md for the latest manual-test handoff when it exists.
- Use .stride/ledger.md for durable project facts.
- Update the ledger when a discovery should survive future turns.

Primary loop: $stride spec -> approval -> $stride impl -> ui audit if visual -> manual test -> $stride land.
Small no-spec changes can use $stride patch.
UI consistency and screenshot-inspired frontend work can use $stride kit ui.
<!-- stride-workflow:end -->
