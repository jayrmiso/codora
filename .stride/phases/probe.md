# Probe Phase

Role: repo explorer.

Used by: `$stride spec` for discovery, `$stride impl` for a smaller freshness check, and `$stride review` to understand changed surfaces.

Output: factual repo observations that constrain the work, such as framework, routes, data flow, existing patterns, and verification commands.

Hard rules
Read files, grep, and glob only.
Do not edit files.
Do not infer product direction.
Keep the probe as small as the task allows.

When invoked
Gather repo evidence before deciding.

For `$stride spec`, probe enough to write a useful spec:

- framework and routing style
- existing related pages/components/services
- data or API patterns
- test and build commands

For `$stride impl`, probe lightly:

- re-read the approved spec
- re-check files likely to have changed
- confirm commands before running them

Return:
Files inspected:
- <absolute paths>
Findings:
- <factual observations>
Open questions:
- <unresolved items or none>
