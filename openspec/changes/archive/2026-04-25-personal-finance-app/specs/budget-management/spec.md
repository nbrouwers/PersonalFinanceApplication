## ADDED Requirements

### Requirement: Budget creation
The system SHALL allow users to create budgets by category with monthly or yearly frequency and spending limits.

#### Scenario: Create monthly budget
- **WHEN** user creates budget for Groceries category with $400 monthly limit
- **THEN** system creates budget record and begins tracking spending

#### Scenario: Create yearly budget
- **WHEN** user creates budget for Travel category with $2000 yearly limit
- **THEN** system creates budget record applicable for entire calendar year

#### Scenario: Budget without category
- **WHEN** user creates budget without selecting category
- **THEN** system returns validation error

### Requirement: Budget tracking
The system SHALL track spending against budgets in real-time and calculate remaining amount.

#### Scenario: Calculate remaining budget
- **WHEN** user has $400 monthly budget and spent $120
- **THEN** system shows $280 remaining for current month

#### Scenario: Budget reset on new period
- **WHEN** month transitions from January to February
- **THEN** system resets monthly budget counters for new month

#### Scenario: Cumulative yearly tracking
- **WHEN** user has yearly budget and transactions span multiple months
- **THEN** system accumulates spending across all months for year-to-date tracking

### Requirement: Budget modification
The system SHALL allow users to modify budget limits and frequencies.

#### Scenario: Increase budget limit
- **WHEN** user increases grocery budget from $400 to $500
- **THEN** system updates budget and recalculates remaining amount

#### Scenario: Change budget frequency
- **WHEN** user converts monthly budget to yearly
- **THEN** system adjusts tracking period and resets counters

### Requirement: Multiple budgets
The system SHALL support multiple budgets for different categories simultaneously.

#### Scenario: Multiple category budgets
- **WHEN** user creates budgets for Groceries, Dining, and Entertainment
- **THEN** system tracks spending for each category independently

#### Scenario: Budget overlap handling
- **WHEN** transactions span multiple budget categories
- **THEN** system correctly allocates spending to each respective budget

### Requirement: Budget history
The system SHALL maintain history of budget performance for previous periods.

#### Scenario: View previous month budget performance
- **WHEN** user views budget history for January
- **THEN** system shows spending vs budget limit for January with final status (under/over)

#### Scenario: Yearly budget rollup
- **WHEN** year completes
- **THEN** system archives yearly budget with final spending summary

### Requirement: Budget goal tracking
The system SHALL allow users to set savings goals with target amounts and deadlines.

#### Scenario: Create savings goal
- **WHEN** user creates goal to save $5000 for vacation by 2026-06-30
- **THEN** system tracks progress toward goal

#### Scenario: Goal completion
- **WHEN** savings deposits reach $5000 before deadline
- **THEN** system marks goal as complete and congratulates user
