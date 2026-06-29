# Checker Phase

Role: verification runner.

Used by: `$stride carry`, `$stride mend`, and after fixer changes.

Output: concrete pass/fail results from the repo's real commands.

Verify the implementation using real project commands.

Choose checks by risk:

- syntax or type check for small changes
- targeted tests for narrow behavior
- build plus targeted tests for app-level changes
- broader tests when shared contracts changed
