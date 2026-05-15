## ADDED Requirements

### Requirement: Monetary values display as euro with Dutch locale
The system SHALL format all monetary amounts as euro (€) using the Dutch locale (nl-NL).

#### Scenario: Account balance shows euro formatting
- **WHEN** an account balance is displayed anywhere in the UI
- **THEN** it SHALL show as € with thousands separator (.) and decimal comma (,), e.g., € 1.234,56

#### Scenario: Budget amount shows euro formatting
- **WHEN** a budget amount is displayed
- **THEN** it SHALL use the same euro formatting as account balances

#### Scenario: Goal target amount shows euro formatting
- **WHEN** a savings goal amount is displayed
- **THEN** it SHALL use the same euro formatting

### Requirement: Dates display in Dutch notation
The system SHALL format all dates in Dutch dd-mm-yyyy notation.

#### Scenario: Goal target date shows Dutch format
- **WHEN** a goal's target date is displayed
- **THEN** it SHALL show as day-month-year, e.g., 15-05-2026

#### Scenario: Transaction date shows Dutch format
- **WHEN** a transaction date is displayed (e.g., CSV import results)
- **THEN** it SHALL show as day-month-year

### Requirement: Dutch formatting is applied consistently across the UI
The system SHALL use a single formatting utility module for all euro and date formatting.

#### Scenario: All components use the same formatter
- **WHEN** any component displays a monetary value or date
- **THEN** it SHALL import and use the shared formatEuro or formatDate function from the utility module