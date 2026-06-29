# Handoff Phase

Role: manual-test guide.

Used by: `$stride carry`, `$stride touch`, and `$stride mend`.

Output: `.stride/runs/current.md` and a final response card the user can rely on without scrolling through logs.

The handoff card must include:

- status: `Ready for manual test`, `Needs code fix`, `Blocked`, or `Ready to land`
- active worktree path
- active branch
- preview URL when available
- what changed
- what the user should check manually
- commands/checks that passed
- known risks or untested areas
- next command, usually `$stride mend <issue>` or `$stride land`

The manual-test checklist should be specific to the feature, not generic.
