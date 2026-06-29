# Source Layout

This project uses the App Router under `src/app` and keeps component ownership explicit:

- `src/app`: route entries, layouts, route handlers, and route-local `_components`
- `src/components`: reusable shared UI used by multiple routes or features
- `src/features`: feature-scoped UI and behavior that should not be global
- `src/shared`: cross-cutting helpers, constants, and generic types
- `src/domain`: core entities and domain models
- `src/infrastructure`: vendor clients and external integrations

Rule of thumb:

- If the component only makes sense for one route, keep it under that route's `_components` folder.
- If the component is generic and likely to be reused, put it in `src/components`.
- If the component belongs to one product area, put it in `src/features/<feature>`.
