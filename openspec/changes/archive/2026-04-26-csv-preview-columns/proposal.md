## Why

After importing a CSV (Triodos format), the preview shows generic columns (date, description, amount, type) instead of the actual CSV fields. Users want to see what they imported.

## What Changes

- Preview columns: Date, IBAN, Amount, Credit/Debit, Name, Description
- Exclude transaction kind (always RE/BA/KN/etc from Triodos)
- Add account name mapping for IBAN

## Capabilities

### Modified Capabilities
- `transaction-import`: Preview shows CSV format columns

## Impact

- Frontend: CSVImport component preview table