# Kit Command

User call:

```text
$stride kit ui
```

Optional reference form:

```text
$stride kit ui from <screenshot-or-reference>
```

Purpose: turn repeated or screenshot-inspired frontend work into a coherent local UI kit instead of one-off page styling.

Internal flow:

```text
worktree -> strideuiauditor -> reference-reader if provided -> kit-designer -> builder -> strideuiauditor again if layout changed -> migrator if needed -> checker -> previewer -> handoff
```

Use this when:

- UI styles are inconsistent across pages
- repeated buttons, cards, forms, headers, empty states, or layout shells should become components
- the user wants to imitate an existing app's UI from a screenshot
- a frontend feature needs a stronger design foundation before implementation continues

Rules:

- Do not copy a reference app's branding, logos, or protected assets.
- Translate references into layout principles, spacing, hierarchy, component behavior, and interaction patterns.
- Prefer existing project libraries and conventions before adding new dependencies.
- Create only the components that remove real duplication or improve consistency.
- Migrate existing UI gradually and keep behavior unchanged unless the spec says otherwise.
- End with a preview, a manual comparison checklist, and a final Playwright-backed visual audit before handoff.
