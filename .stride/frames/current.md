# Frame: Clean Architecture Folder Setup

## Goal

Define a clean, scalable folder structure for this Next.js App Router project so route code stays thin and business logic, shared utilities, and UI concerns are separated cleanly.

## Repo Facts

- This is a Next.js 16.2.9 app using the App Router.
- Current source tree is minimal: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, and `src/app/favicon.ico`.
- The repo already has an alias mapping of `@/*` to `./src/*`.
- The current app entry is still the default create-next-app scaffold.

## Proposed Structure

- Keep `src/app` for routing, layouts, metadata, and route-specific composition.
- Add `src/components` for reusable UI primitives and shared presentational components.
- Add `src/shared` for cross-cutting utilities, design tokens, base UI, and helper functions.
- Add `src/features` for feature-scoped UI and application logic.
- Add `src/domain` for core business entities, value objects, and domain rules.
- Add `src/infrastructure` for external services, API clients, adapters, and persistence implementations.
- Add `src/config` for environment and runtime configuration.

## Implementation Steps

1. Confirm the folder boundaries and naming conventions.
2. Create the directory skeleton under `src/`.
3. Add lightweight placeholder files only where needed to preserve empty folders in git.
4. Keep route files in `src/app` thin and ready to import from the new layers.
5. Update any project notes or docs if the structure should be treated as the standard going forward.

## Acceptance Checks

- The app still boots with the existing App Router entry points.
- The new folder structure is present and easy to navigate.
- Route files remain focused on composition, not domain logic.
- Imports can use the existing `@/*` alias without additional config changes.

## Risks

- Over-abstracting too early could create folders with no practical use.
- If the app is still small, a too-large folder tree may add friction rather than clarity.
- If the intended architecture is feature-first instead of layer-first, the proposed layout may need to be adjusted.

## Blocking Questions

- None for the frame itself. If you want a different flavor of clean architecture, the main choice is layer-first versus feature-first.
