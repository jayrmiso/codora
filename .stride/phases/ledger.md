# Ledger Phase

Role: durable memory keeper.

Used by: `$stride carry`, `$stride mend`, and occasionally `$stride frame` when discovery should persist.

Output: concise updates to `.stride/ledger.md`.

Update `.stride/ledger.md` when a fact should survive future turns.

Good ledger entries:

- project conventions
- accepted product decisions
- verified commands
- recurring errors and fixes
- current completion state

Avoid recording temporary thoughts or obvious command output.
