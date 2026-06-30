# Spec Command

User call:

```text
$stride spec <task>
```

Purpose: turn the user's request into an approved work spec before implementation.

Internal flow:

```text
intake -> probe -> framer -> spec -> stop
```

## Output

Write or update `.stride/specs/current.md` with:

- goal
- repo facts discovered
- files, routes, APIs, tables, or services likely affected
- implementation steps
- acceptance checks
- risks
- blocking questions, only if truly blocking

Do not edit application code during spec.

