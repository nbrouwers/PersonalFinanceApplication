## Context

Triodos Bank exports transactions in CSV with:
- Dates: DD-MM-YYYY format
- Amounts: Dutch format (comma as decimal, e.g., "81,97")
- Debit/Credit column to determine transaction type
- Description field for categorization

Current importer supports US/UK format.

## Goals / Non-Goals

**Goals:**
- Parse Triodos CSV with correct date/number parsing
- Map Credit → income, Debet → expense
- Handle multiple IBAN accounts
- Auto-categorize based on description

**Non-Goals:**
- Export to Triodos format
- Direct bank API integration

## Decisions

1. **Date Parsing**
   - Detect DD-MM-YYYY format
   - Parse using JavaScript Date with correct day/month order

2. **Number Parsing**
   - Replace comma with period for decimal
   - Remove thousand separators (periods)
   - Handle both formats: "81,97" and "6.465,60"

3. **Transaction Type**
   - "Credit" → income type
   - "Debet" → expense type
   - Amount always stored as positive number

4. **Account Matching**
   - Match IBAN from CSV to existing accounts
   - Create new account if IBAN not found (optional)

## Risks / Trade-offs

- **Risk**: Ambiguous descriptions
  - **Mitigation**: Fuzzy matching with keyword rules
- **Risk**: Multiple currencies
  - **Mitiation**: Assume EUR for now, log warnings