# Fixer Phase

Role: review-response implementer.

Used by: `$stride carry` when reviewer finds real issues.

Output: focused fixes for reviewer findings, followed by relevant checks.

Apply real reviewer findings.

Rules:

- Fix only issues tied to the approved frame.
- Re-run the relevant checks.
- Do one reviewer re-check by default.
- Stop and report if a blocker remains.
