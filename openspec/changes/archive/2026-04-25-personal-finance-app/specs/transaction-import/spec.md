## ADDED Requirements

### Requirement: CSV file upload
The system SHALL allow users to upload bank transaction CSV files for import.

#### Scenario: Successful CSV upload
- **WHEN** user selects CSV file and clicks "Import"
- **THEN** system accepts file and begins parsing

#### Scenario: Invalid file format
- **WHEN** user attempts to upload non-CSV file
- **THEN** system rejects file with error message

#### Scenario: Large file handling
- **WHEN** user uploads large CSV file (10,000+ transactions)
- **THEN** system processes file asynchronously with progress indicator

### Requirement: CSV format detection
The system SHALL automatically detect CSV structure and column mapping from bank-specific formats.

#### Scenario: Auto-detect common bank formats
- **WHEN** user uploads CSV from major banks (Chase, Bank of America, Wells Fargo, etc.)
- **THEN** system automatically maps columns (Date, Amount, Description, Balance)

#### Scenario: Manual column mapping
- **WHEN** user uploads CSV with non-standard format
- **THEN** system displays preview and allows manual mapping of columns to transaction fields

#### Scenario: Column mapping validation
- **WHEN** user completes manual mapping
- **THEN** system validates that required fields (Date, Amount) are mapped

### Requirement: Transaction parsing
The system SHALL parse CSV rows into transaction objects with proper data type conversion.

#### Scenario: Parse transaction fields
- **WHEN** CSV row is parsed
- **THEN** system extracts: Date (DD/MM/YYYY or MM/DD/YYYY), Amount (numeric), Description (string), Account (optional)

#### Scenario: Data type validation
- **WHEN** transaction row contains invalid date or non-numeric amount
- **THEN** system logs error and skips row with user notification

#### Scenario: Transaction direction detection
- **WHEN** amount is positive/negative or separate debit/credit columns exist
- **THEN** system correctly determines transaction type (income/expense)

### Requirement: Duplicate detection
The system SHALL identify transactions that have already been imported to prevent duplication.

#### Scenario: Exact match detection
- **WHEN** imported transaction matches existing transaction (same date, amount, description within 95% text similarity)
- **THEN** system flags as potential duplicate and skips import

#### Scenario: Fuzzy matching for descriptions
- **WHEN** descriptions vary slightly (e.g., "WHOLE FOODS #123" vs "WHOLE FOODS #124")
- **THEN** system applies fuzzy matching to identify duplicates from same merchant

#### Scenario: Multi-account duplicate detection
- **WHEN** CSV contains transactions from multiple accounts
- **THEN** system applies duplicate detection across all user accounts, not just same account

#### Scenario: Duplicate report
- **WHEN** import completes
- **THEN** system displays report: X transactions imported, Y duplicates skipped, Z errors encountered

### Requirement: Multi-account support
The system SHALL support importing transactions from multiple bank accounts in single CSV or multiple uploads.

#### Scenario: Identify account in CSV
- **WHEN** CSV includes account identifier or account column
- **THEN** system maps transactions to correct account

#### Scenario: Manual account selection
- **WHEN** account cannot be auto-detected from CSV
- **THEN** system prompts user to select account for transactions

#### Scenario: Create new account
- **WHEN** CSV references account not in user's system
- **THEN** system offers to create new account with user confirmation

### Requirement: Currency handling
The system SHALL preserve original currency from imported transactions or allow currency specification.

#### Scenario: Explicit currency column
- **WHEN** CSV contains currency column
- **THEN** system uses specified currency for each transaction

#### Scenario: Default currency
- **WHEN** CSV does not specify currency
- **THEN** system uses account's primary currency or prompts user selection

### Requirement: Import preview
The system SHALL display preview of transactions before confirming import.

#### Scenario: Preview import results
- **WHEN** CSV is parsed successfully
- **THEN** system displays preview: first 10 transactions with mapped fields for verification

#### Scenario: Preview corrections
- **WHEN** user notices errors in preview
- **THEN** system allows modification of column mapping and re-parsing

#### Scenario: Confirm import
- **WHEN** user confirms preview
- **THEN** system imports transactions and updates dashboard

### Requirement: Categorization on import
The system SHALL apply automatic categorization to imported transactions based on description.

#### Scenario: Auto-categorize by description
- **WHEN** transaction is imported with description "Whole Foods"
- **THEN** system automatically assigns "Groceries" category if matching rule exists

#### Scenario: Uncategorized handling
- **WHEN** transaction cannot be automatically categorized
- **THEN** system marks as uncategorized for user to assign later

### Requirement: Import history and rollback
The system SHALL track all imports and allow users to undo recent imports.

#### Scenario: View import history
- **WHEN** user views import history
- **THEN** system displays list of past imports with timestamp, file name, transaction count

#### Scenario: Undo recent import
- **WHEN** user selects import to undo within 24 hours
- **THEN** system removes transactions from that import batch

#### Scenario: Cannot undo old imports
- **WHEN** user attempts to undo import older than 24 hours
- **THEN** system displays message that undo window has expired

### Requirement: Batch import operations
The system SHALL allow scheduling or batch importing of multiple CSV files.

#### Scenario: Import multiple files
- **WHEN** user selects multiple CSV files at once
- **THEN** system queues imports and processes sequentially

#### Scenario: Scheduled imports
- **WHEN** user enables recurring import from same CSV source
- **THEN** system can schedule automated imports (e.g., weekly from downloaded CSV)
