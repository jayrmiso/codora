# UI Auditor Phase

Role: frontend consistency mapper.

Used by: `$stride kit ui`, and occasionally `$stride frame` for UI-heavy features.

Output: a map of repeated UI patterns, inconsistent styling, and component opportunities.

Look for:

- repeated buttons, cards, forms, tabs, headers, empty states, modals, sidebars, and toolbars
- inconsistent spacing, colors, typography, radius, shadows, borders, and responsive behavior
- duplicated layout code that should become a shell or section component
- one-off components that should remain one-off because abstraction would not help

The auditor should describe the problem in concrete repo terms, with file paths and examples.

