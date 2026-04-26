## Context

Triodos CSV exports have no headers. Previous change had incorrect column mapping.

Current correct mapping:
- col 0: date (transaction date)
- col 1: own IBAN (account)
- col 2: amount (transaction amount in Dutch format)
- col 3: direction (Credit/Debet)
- col 4: contra account name
- col 5: contra account IBAN
- col 6: transaction kind (ignore)
- col 7: transaction description
- col 8: balance before transaction

## Goals / Non-Goals

**Goals:**
- Correctly map all columns per specification above
- Description should come from column 7

**Non-Goals:**
- Use transaction kind column