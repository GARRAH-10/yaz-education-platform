# V22.5 — Programme discovery UX

This release makes programme discovery explicit instead of relying on the search icon.

## Changes

- Added `Programmes` to the primary desktop and mobile navigation.
- Added a desktop mega menu grouped by major study areas.
- Clicking a field opens `/[locale]/programmes?field=...` with that field preselected.
- Added a homepage Quick Programme Finder with study-level and field selectors.
- Finder routes directly to filtered programme results.
- Programme directory now reads `field`, `level`, and `q` query parameters as initial filters.
- Kept the magnifying-glass icon as a secondary/general discovery route.

No database migration is required for V22.5.
