# Codora Product Concept

Source: `product-concept.pdf`

## What It Is

Codora is a programming problem-solving app. Users open a problem, write code in a frontend editor, submit it, and get their solution checked against test cases.

The app tracks attempts and progress so users can see improvement over time. Python is the first supported language and compiler, but the product is not limited to Python long-term.

## Why It Exists

Codora exists to give users a place to solve programming problems and test their skills with clear feedback, visible progress, and leaderboard-style competition.

## What Users Do

1. Sign up and provide proficiency level.
2. Choose learning tags.
3. Browse a problem library organized by topic and difficulty.
4. Open a problem and start a timed attempt.
5. Write code in the editor and submit it.
6. See whether all test cases pass.
7. Review a short explanation and optional AI review suggestions after submission.
8. Check progress, stats, and leaderboard standing over time.

## Core Experience

- Problem prompt
- Frontend code editor
- Run and submit flow
- Attempt history
- Hidden test cases plus one visible example
- Pass/fail grading when all tests are evaluated
- Short post-submit explanation
- Optional Gemini-based review suggestions
- Progress stats and leaderboards

## Main Surfaces

### Problem Library

The place users choose problems from. It should be organized by topic and difficulty.

### Problem Session

The focused solving experience. The timer starts when the user opens a problem, code is written in the editor, and submission records an attempt.

### Reviewer Library

A read-only reference area for reviewing Python docs and concepts. It is not a teacher surface and does not replace the problem-solving flow.

### Progress and Stats

A place to show improvement over time, problem completion, and competition results.

## Content Model

- Problems
- Attempts
- Test cases
- Tags
- Difficulty
- Topics
- Review/explanation content

## Product Principles

- Make problem solving the center of the app.
- Keep the reviewer/docs area separate and read-only.
- Treat attempts as durable history.
- Keep grading strict: a submission passes only when all tests pass.
- Make progress visible, not hidden behind the competition layer.

## Scope Notes

Python is the first language and compiler, but Codora should be framed as a programming app that can expand later.

The first release should stay narrow enough to support the core loop cleanly without pretending to be a full learning platform or a full IDE.
