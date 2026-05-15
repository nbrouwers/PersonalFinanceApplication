## ADDED Requirements

### Requirement: Set and monitor monthly/yearly budgets by category
The system SHALL allow users to define budget limits for categories and track spending against those limits.

#### Scenario: Set a monthly budget
- **WHEN** user sets a budget amount for a specific category for a given month
- **THEN** system stores the budget and allows tracking of expenses against it

#### Scenario: Set a yearly budget
- **WHEN** user sets a budget amount for a specific category for a given year
- **THEN** system stores the budget and allows tracking of expenses against it

#### Scenario: Track spending against budget
- **WHEN** user records transactions in a category with a budget
- **THEN** system calculates remaining budget and alerts user when approaching or exceeding limits

#### Scenario: View budget summary
- **WHEN** user requests budget information for a category or time period
- **THEN** system displays budgeted amount, spent amount, remaining amount, and percentage used