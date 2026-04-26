## MODIFIED Requirements

### Requirement: Import preview shows CSV columns
The system SHALL display the imported data in columns matching the CSV format.

#### Scenario: Triodos preview
- **WHEN** user previews Triodos import
- **THEN** columns shown are: Date, IBAN, Amount, Credit/Debit, Name, Description

#### Scenario: Generic preview
- **WHEN** user previews generic CSV import
- **THEN** columns shown are: Date, Amount, Description, Type