# Codora Decisions

Source: `decisions.pdf`

## Confirmed

- Codora is a programming problem-solving app.
- Python is the first supported language and compiler.
- Users solve problems in a frontend editor and submit code.
- Attempts are stored.
- An attempt passes only when all tests pass.
- The app should show progress over time.
- The reviewer/docs area is read-only.
- Problem and reviewer libraries should be organized by topic and difficulty.
- The first build pass uses Next.js + Supabase only.
- The frontend and backend API both live in Next.js.
- Supabase handles auth and database.
- GitHub is the login provider.
- Environment variables will include database and Supabase configuration, including URL and publishable key.
- User onboarding should capture proficiency level and learning tags.
- Daily problem count is not required for signup.
- Hidden tests stay hidden, with one visible example.
- Failure feedback should include both hints and errors.
- A short post-submit explanation should be shown.
- Gemini-based review suggestions are part of the product direction.
- AI-generated problems and test cases will later be pushed into the database by a separate script.

## Still Open

- Leaderboard scoring formula
- Dashboard priority stats
- Execution and grading runtime path
- Exact post-submit UX
- Content generation workflow details
