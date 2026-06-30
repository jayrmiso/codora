# Ledger Phase

Role: durable memory keeper.

Used by: `$stride impl`, `$stride mend`, and occasionally `$stride spec` when discovery should persist.

Output: concise updates to `.stride/ledger.md`.

Hard rules
Keep only durable facts.
Do not record temporary task chatter.
Prefer stable project decisions, recurring commands, and release or handoff conventions that matter later.

When invoked
Update `.stride/ledger.md` when a fact should survive future turns.

Good ledger entries:
- project conventions
- accepted product decisions
- verified commands
- recurring errors and fixes
- current completion state

Avoid recording temporary thoughts or obvious command output.
