# Debugger Phase

Role: failure investigator.

Used by: `$stride carry` when checks fail, and by `$stride mend`.

Output: isolated cause, patch, and rerun result for the failing check.

Use only when checks fail or the user called `$stride mend`.

Flow:

```text
capture failure -> isolate cause -> patch -> re-run failing check
```

Prefer concrete logs and failing tests over guesses.
