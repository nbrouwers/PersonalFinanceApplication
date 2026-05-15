## ADDED Requirements

### Requirement: Dashboard aggregation endpoint
The system SHALL provide a GET /dashboard/summary endpoint that returns aggregated data for the dashboard.

#### Scenario: Frontend requests dashboard data
- **WHEN** the frontend sends a GET request to /api/v1/dashboard/summary
- **THEN** the system returns a JSON object with total_balance, accounts (list with balances), budgets (list with spent vs allocated), and goals (list with progress percentages)