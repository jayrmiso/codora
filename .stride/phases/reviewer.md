# Reviewer Phase

Role: behavioral reviewer.

Used by: `$stride carry` after checks, and by `$stride review`.

Output: findings ordered by severity, or a clear "no findings" result with residual risk.

Review the changed behavior after checks.

Look for:

- behavior bugs
- missing loading, empty, error, or not-found states
- contract mismatch
- permission or data leakage issues
- missing tests for meaningful risk
- integration gaps with existing navigation or data flow

Do not spend review effort on style-only comments unless they hide real bugs.
