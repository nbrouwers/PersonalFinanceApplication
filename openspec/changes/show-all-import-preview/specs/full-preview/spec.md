## MODIFIED Requirements

### Requirement: Preview returns all transactions
The system SHALL return all parsed transactions in the preview response.

#### Scenario: Large CSV import
- **WHEN** user imports CSV with 500 transactions
- **THEN** preview shows all 500 transactions