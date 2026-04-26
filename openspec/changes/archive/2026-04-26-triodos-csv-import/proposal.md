## Why

Users with Triodos Bank accounts need to import their transactions. Triodos exports CSV with Dutch decimal format (comma as separator) and European date format. Current importer doesn't support this format.

## What Changes

- Add Triodos CSV format parser supporting:
  - Dutch number format (comma decimal separator, period thousands)
  - European date format (DD-MM-YYYY)
  - Credit/Debit indicator to determine transaction type
  - Description field for auto-categorization
- Update transaction schema to include account fields (IBAN)
- Add account management for multiple bank accounts

## Capabilities

### New Capabilities
- `triodos-csv-parser`: Parse Triodos CSV with Dutch formatting
- `multi-account-support`: Track multiple bank accounts per user

### Modified Capabilities
- `transaction-import`: Support Triodos format alongside existing formats
- `transaction-tracking`: Extended with account IBAN field

## Impact

- Backend: New CSV parser, extended transaction model
- Frontend: Account selector dropdown
- Database: Add account_id to transactions table