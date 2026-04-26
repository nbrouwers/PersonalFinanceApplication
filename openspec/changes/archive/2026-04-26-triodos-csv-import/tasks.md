## 1. Database - Add Account Field

- [x] 1.1 Add account_id column to transactions table
- [x] 1.2 Create accounts table with IBAN field
- [x] 1.3 Update transaction model

## 2. Backend - Account Management

- [x] 2.1 Add GET /api/v1/accounts endpoint
- [x] 2.2 Add POST /api/v1/accounts endpoint
- [x] 2.3 Update transactions to include account_id

## 3. Backend - Triodos CSV Parser

- [x] 3.1 Detect Triodos format (headers match)
- [x] 3.2 Parse DD-MM-YYYY dates
- [x] 3.3 Parse Dutch number format
- [x] 3.4 Map Credit/Debit to transaction type
- [x] 3.5 Match IBAN to accounts
- [x] 3.6 Auto-categorize by description

## 4. Frontend - Account Selection

- [x] 4.1 Add account dropdown to import dialog
- [x] 4.2 Show account name in transaction list
- [x] 4.3 Allow creating accounts from import

## 5. Testing

- [x] 5.1 Test with sample Triodos CSV
- [x] 5.2 Verify date/number parsing
- [x] 5.3 Test categorization accuracy