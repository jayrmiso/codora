---
name: strideuiauditor
description: Stride Workflow skill for visual auditing. Use when a user-facing change needs a read-only pass on density, hierarchy, spacing, and polish.
---

# Stride UI Auditor

Use this skill when a user-facing change needs an explicit visual quality pass.

## Use when

- The change affects UI, layout, copy density, spacing, or visual balance.
- You need a read-only pass that can say whether the result feels ugly, cramped, or polished.
- The change should be checked before preview handoff or land.
- The live UI should be inspected in Playwright when a preview URL or local route is available.
- If the route is auth-gated, Playwright must use the authenticated context provided by the previewer or project docs.

## Do

- Inspect the scoped UI change directly.
- Check the rendered UI in Playwright, starting the app from the edited worktree if needed.
- If the active worktree lacks the local env file, source or export it from the parent checkout or repo folder that does before launching the app.
- If Playwright cannot run, treat the audit as blocked instead of asking the main chat to do the render check.
- If the page redirects to sign-in or otherwise needs auth and no authenticated Playwright context is available, return blocked.
- Check visual hierarchy, spacing, rhythm, consistency, responsiveness, interaction clarity, and accessibility.
- Be concrete about what looks off and what should change.
- Return findings the builder can act on.
