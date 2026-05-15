## Why

The current UI is a single-page list of forms with no structure, no navigation, and no visual feedback on financial status. Users need a proper dashboard that shows their financial health at a glance with charts and trends, plus dedicated screens for managing accounts, budgets, and savings goals.

## What Changes

- Replace the single-page form layout with a multi-screen app (routing via react-router)
- Create a **Dashboard** landing page with graphical overviews:
  - Account balances overview (pie chart or bar chart)
  - Budget progress bars showing spent vs. allocated
  - Savings goal progress with completion percentages and trends
- Add separate **CRUD management screens** for accounts, budgets, and savings goals with dedicated list/detail/edit views
- Add a **CSV Import page** accessible from the navigation
- Add client-side routing (e.g., React Router) with a navigation sidebar or tabs
- Update the backend API with dashboard aggregation endpoints if needed

## Capabilities

### New Capabilities
- `dashboard`: Main dashboard page with graphical overviews of account balances, budget status, and savings goal progress using charts
- `ui-navigation`: Responsive navigation (sidebar/tabs) linking between Dashboard, Accounts, Budgets, Goals, and CSV Import pages

### Modified Capabilities
- `rest-api`: Add dashboard aggregation endpoints to serve chart data (account totals, budget spent vs allocated, goal progress)

## Impact

- Frontend: Major restructuring of `frontend/src/App.js`, new page components, routing setup, chart library dependency, new navigation structure
- Backend: New API endpoints for dashboard data aggregation
- Dependencies: Add `react-router-dom`, `recharts` (or similar chart library) to frontend
- No changes to database models