## Context

The current UI is a single-page scroll of forms and lists with no navigation, no visual hierarchy, and no dashboard. Users have no way to see their overall financial health at a glance. The backend API exists for CRUD operations on accounts, budgets, and goals, but no dashboard aggregation endpoints exist yet.

## Goals / Non-Goals

**Goals:**
- Restructure the frontend into a multi-page app with client-side routing
- Build a Dashboard landing page with charts: account balances (pie), budget progress (horizontal bars), savings goal progress (radial/progress bars)
- Build dedicated CRUD management pages for accounts, budgets, and savings goals
- Build a CSV import page accessible from the navigation
- Add navigation sidebar or bottom tabs for page switching
- Add backend aggregation endpoints for dashboard data

**Non-Goals:**
- No transaction management CRUD (CSV import only, as stated)
- No real-time updates (page refresh to see new data)
- No user authentication UI (exists in backend but not surfaced yet)
- No dark mode or theme customization

## Decisions

### Routing: React Router v6
Using React Router v6 because it's the standard for React navigation, supports nested routes, and integrates well with MUI.

### Charts: Recharts
Using Recharts (built on React components) because:
- Native React integration (no imperative DOM manipulation)
- Supports bar, pie, and line charts needed for dashboard
- Lightweight and customizable
- Alternatives considered: Chart.js (more imperative), D3 (lower-level, steeper learning curve)

### Layout: MUI Drawer sidebar
Using a permanent/expandable MUI Drawer on desktop, hidden on mobile (bottom tabs) because:
- Consistent with Material Design patterns
- Works with existing MUI dependency
- Allows for future addition of more pages without layout changes

### Page Structure
```
/                  → redirect to /dashboard
/dashboard         → charts overview
/accounts          → account list + CRUD
/budgets           → budget list + CRUD  
/goals             → savings goals list + CRUD
/import            → CSV import page
```

### Backend: Aggregation endpoints
New endpoint `GET /api/v1/dashboard/summary` that returns:
- Total balance across all accounts
- Per-account list with balances
- Budget list with spent vs allocated (computed on backend)
- Goal list with progress percentages

This prevents the frontend from making 3-4 separate API calls on dashboard load.

## Risks / Trade-offs

[Recharts version compatibility] → Mitigation: Pin to a version compatible with React 19; test build before merge
[Backend aggregation query performance] → Mitigation: Keep the dashboard endpoint simple (no complex joins); if large datasets become an issue, add caching later
[Overwhelming change size] → Mitigation: Implement pages incrementally: Dashboard first, then navigation, then CRUD pages, then import page

## Open Questions

- Should the dashboard charts show trends over time (e.g., last 6 months balances)? Yes, initial version shows current state; trends can be added in a follow-up
- Should the navigation be persistent (sidebar visible on all pages) or collapsible? Persistent sidebar on desktop, bottom navigation on mobile to save screen space