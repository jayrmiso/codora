# Review Command

User call:

```text
$stride review
```

Purpose: inspect current changes without implementing new scope.

Internal flow:

```text
diff probe -> reviewer -> findings
```

Findings come first, ordered by severity, with file and line references.

