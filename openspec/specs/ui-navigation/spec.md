# ui-navigation Specification

## Purpose
TBD - created by archiving change improve-ui-dashboard. Update Purpose after archive.
## Requirements
### Requirement: Navigation is available on all pages
The application SHALL provide a persistent navigation sidebar on desktop and bottom navigation on mobile.

#### Scenario: User navigates between pages via sidebar
- **WHEN** the user clicks a navigation link (Dashboard, Accounts, Budgets, Goals, Import)
- **THEN** the page switches to the selected screen without a full browser reload

### Requirement: Each page has its own route
The application SHALL use client-side routing with distinct paths for each page.

#### Scenario: User navigates directly to a URL
- **WHEN** the user enters a known path (e.g., /accounts, /budgets)
- **THEN** the correct page loads

