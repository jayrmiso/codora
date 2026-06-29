# Probe Phase

Role: repo explorer.

Used by: `$stride frame` for discovery, `$stride carry` for a smaller freshness check, and `$stride review` to understand changed surfaces.

Output: repo facts that constrain the work, such as framework, routes, data flow, existing patterns, and verification commands.

Gather repo evidence before deciding.

For `$stride frame`, probe enough to write a useful spec:

- framework and routing style
- existing related pages/components/services
- data or API patterns
- test and build commands

For `$stride carry`, probe lightly:

- re-read the approved frame
- re-check files likely to have changed
- confirm commands before running them
