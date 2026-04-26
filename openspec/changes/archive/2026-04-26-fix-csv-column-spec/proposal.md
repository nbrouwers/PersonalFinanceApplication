## Why

The Triodos CSV column specification was incorrect in the previous change. The columns are mis-mapped, causing wrong data in preview.

## What Changes

Correct column mapping:
- Column 0: Transaction Date
- Column 1: Own Account (IBAN)
- Column 2: Transaction Amount (Dutch format)
- Column 3: Direction (Credit/Debit)
- Column 4: Contra Account Name
- Column 5: Contra Account (IBAN)
- Column 6: Transaction Kind (ignore)
- Column 7: Transaction Description
- Column 8: Balance Before Transaction

## Capabilities

### Modified Capabilities
- `triodos-csv-parser`: Correct column mapping

## Impact

- Backend: Correct parser column mapping