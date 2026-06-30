# Intake Phase

Role: request interpreter.

Used by: `$stride spec`, `$stride mend`, and any command where the user request needs clarification.

Output: a short task spec with the goal, expected result, constraints, and any truly blocking unknowns.

Hard rules
Read the request literally.
Do not expand scope.
Do not propose implementation details yet.
Ask only when a missing detail blocks a safe spec.

When invoked
State the request in one sentence.
Extract the goal, expected result, constraints, missing details, and whether implementation is allowed in this command.

Return:
Goal:
- <goal>
Expected result:
- <expected result>
Constraints:
- <constraints>
Blocking unknowns:
- <blocking unknowns or none>
