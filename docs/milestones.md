# Codora Milestones

This document breaks the current product direction into build milestones with concrete tasks.

## Milestone 1: Auth, Onboarding, and App Shell

Goal: get a signed-in user into the app with profile preferences captured and a stable shell to return to.

Tasks:
- Keep `/sign-in` and `/sign-up` working with Supabase auth.
- Add onboarding for `proficiency_level`.
- Add onboarding for learning tag selection.
- Persist onboarding data to `profiles` and `profile_learning_tags`.
- Keep `/home` as the authenticated landing page.
- Show a dashboard summary on `/home` with progress-oriented entry points.
- Keep route protection in place for unauthenticated users.

## Milestone 2: Problem Library

Goal: let users browse the problem catalog before opening a solving session.

Tasks:
- Build `/problems` as the main library page.
- Support browsing by topic.
- Support browsing by difficulty.
- Show problem cards or rows with title, topic, difficulty, and status.
- Add search or filtering if it fits the first pass.
- Load published problems only.

## Milestone 3: Problem Session

Goal: support the core solve flow from opening a problem to submitting code.

Tasks:
- Build `/problems/[slug]` as the problem detail page.
- Show the problem prompt and one visible example.
- Show starter code for Python.
- Add an editor surface for writing code.
- Add a timer for the attempt session.
- Add run and submit actions.
- Create attempts in the database when the user starts or submits a session.

## Milestone 4: Submission Results and Attempt History

Goal: show what happened after a submission and preserve the attempt record.

Tasks:
- Show pass/fail results after submission.
- Display test feedback and failure details.
- Show the short post-submit explanation.
- Show the attempt history for a problem.
- Add a global `/attempts` page for recent attempts.
- Keep attempts as durable history, not transient UI state.

## Milestone 5: Progress and Leaderboard

Goal: expose improvement over time and competition using attempt history.

Tasks:
- Build `/progress`.
- Build `/leaderboard`.
- Show completed problems, pass rate, and trend data.
- Derive stats from attempts rather than storing duplicate truth.
- Decide the first leaderboard scoring formula.
- Keep the competition layer secondary to problem solving.

## Milestone 6: Reviewer Library

Goal: provide a separate read-only reference area that does not blur into the solving flow.

Tasks:
- Build `/reviewer` as the library landing page.
- Build `/reviewer/[slug]` for individual articles.
- Support browsing by topic and difficulty.
- Keep the surface read-only.
- Add short reference content for Python concepts and docs.

## Milestone 7: Content and Admin Pipeline

Goal: make it possible to grow the catalog without manually editing app code.

Tasks:
- Add a content ingestion path for problems and test cases.
- Add a content ingestion path for reviewer articles.
- Define how AI-generated content is validated before publishing.
- Add any admin-only tools needed to publish or unpublish content.
- Keep generated content separate from user-facing solve flow logic.

## Suggested Build Order

1. Milestone 1
2. Milestone 2
3. Milestone 3
4. Milestone 4
5. Milestone 5
6. Milestone 6
7. Milestone 7

