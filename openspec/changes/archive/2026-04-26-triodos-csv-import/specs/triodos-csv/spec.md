## ADDED Requirements

### Requirement: Parse Triodos CSV date format
The system SHALL parse dates in DD-MM-YYYY format from Triodos CSV.

#### Scenario: Parse valid date
- **WHEN** CSV contains "01-01-2026"
- **THEN** system creates transaction with date 2026-01-01

### Requirement: Parse Dutch number format
The system SHALL parse amounts with comma decimal separator.

#### Scenario: Parse amount with comma
- **WHEN** CSV contains "81,97"
- **THEN** system creates transaction with amount 81.97

#### Scenario: Parse amount with thousands separator
- **WHEN** CSV contains "6.465,60"
- **THEN** system creates transaction with amount 6465.60

### Requirement: Map Debit/Credit to transaction type
The system SHALL determine transaction type based on Debet/Credit column.

#### Scenario: Credit transaction is income
- **WHEN** CSV row has "Credit" in column D
- **THEN** system creates income transaction

#### Scenario: Debet transaction is expense
- **WHEN** CSV row has "Debet" in column D
- **THEN** system creates expense transaction

### Requirement: Match IBAN to account
The system SHALL match IBAN from CSV to user accounts.

#### Scenario: Known account
- **WHEN** CSV contains IBAN matching user's account
- **THEN** transaction is assigned to that account

### Requirement: Auto-categorize from description
The system SHALL attempt to categorize based on description keywords.

#### Scenario: Match keyword to category
- **WHEN** description contains "AH Waalre"
- **THEN** transaction is categorized as Groceries