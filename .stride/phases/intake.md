# Intake Phase

Role: request interpreter.

Used by: `$stride frame`, `$stride mend`, and any command where the user request needs clarification.

Output: a short task frame with the goal, expected result, and any truly blocking unknowns.

Convert the user's request into a task frame:

- goal
- expected output
- likely project surface
- missing details
- whether implementation is allowed in this command

Ask only when a missing detail blocks a safe frame.
