## ADDED Requirements

### Requirement: Transaction creation
The system SHALL allow users to record income and expense transactions with amount, date, description, and currency.

#### Scenario: Create expense transaction
- **WHEN** user submits new expense transaction with $50, description "lunch", and USD currency
- **THEN** system creates transaction record and returns transaction ID

#### Scenario: Create income transaction
- **WHEN** user submits new income transaction with $2000, description "salary", and USD currency
- **THEN** system creates transaction record as income type

#### Scenario: Missing required fields
- **WHEN** user submits transaction without amount or date
- **THEN** system returns validation error

### Requirement: Transaction retrieval
The system SHALL retrieve transactions for authenticated user with filtering by date range, category, type, and currency.

#### Scenario: Retrieve all transactions
- **WHEN** user requests all transactions for their account
- **THEN** system returns list of transactions ordered by date descending

#### Scenario: Filter by date range
- **WHEN** user requests transactions between 2026-01-01 and 2026-03-31
- **THEN** system returns only transactions within specified date range

#### Scenario: Filter by category
- **WHEN** user requests transactions in "Groceries" category
- **THEN** system returns only transactions assigned to that category

#### Scenario: Paginated results
- **WHEN** user requests transactions with page size 20 and page 2
- **THEN** system returns transactions 21-40 ordered by date

### Requirement: Transaction modification
The system SHALL allow users to edit existing transactions except archived transactions.

#### Scenario: Successful edit
- **WHEN** user updates transaction amount from $50 to $75
- **THEN** system updates transaction and returns confirmation

#### Scenario: Cannot edit archived transaction
- **WHEN** user attempts to modify transaction older than 1 year
- **THEN** system returns error - transaction is archived

### Requirement: Transaction deletion
The system SHALL allow users to delete transactions with soft delete (logical deletion, not physical removal).

#### Scenario: Successful deletion
- **WHEN** user deletes a transaction
- **THEN** system marks transaction as deleted and hides from normal queries

#### Scenario: Permanent deletion
- **WHEN** user permanently deletes a transaction
- **THEN** system physically removes transaction after 30-day grace period

### Requirement: Multi-currency support
The system SHALL store transactions in original currency and support currency conversion for reporting.

#### Scenario: Store transaction in EUR
- **WHEN** user creates transaction with amount 50 and currency EUR
- **THEN** system stores transaction with EUR designation

#### Scenario: Currency conversion for reports
- **WHEN** user views report with mixed currencies
- **THEN** system converts all amounts to user's home currency using daily exchange rates

### Requirement: Transaction attachments
The system SHALL allow users to attach receipts and notes to transactions.

#### Scenario: Attach receipt image
- **WHEN** user uploads receipt image to transaction
- **THEN** system stores attachment and links to transaction

### Requirement: Duplicate transaction detection
The system SHALL warn users of potential duplicate transactions (same amount, date within 24 hours).

#### Scenario: Warn on duplicate
- **WHEN** user creates transaction matching recent transaction
- **THEN** system displays warning with option to confirm or cancel
