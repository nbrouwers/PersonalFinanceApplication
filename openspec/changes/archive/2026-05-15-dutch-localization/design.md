## Context

The application currently displays monetary values as plain numbers (e.g., `1000.00`) and dates in ISO format (e.g., `2026-05-15`). For Dutch users, values should display as euro with the `nl-NL` locale (e.g., `€ 1.000,00`) and dates in Dutch notation (`15-05-2026`).

## Goals / Non-Goals

**Goals:**
- Create reusable formatting utilities for euro currency and Dutch date notation
- Apply euro formatting everywhere monetary values are displayed (dashboard charts, account lists, budget amounts, goal targets, CSV import summaries)
- Apply Dutch date formatting everywhere dates are displayed
- Keep backend API responses locale-agnostic (formatting is a frontend concern)

**Non-Goals:**
- No changes to data storage or API responses (backend stays locale-agnostic)
- No full i18n framework (only locale formatting, not translations)
- No user-selectable locale switching (single locale for now)

## Decisions

### Intl API over a library
Using JavaScript's built-in `Intl.NumberFormat` and `Intl.DateTimeFormat` with the `nl-NL` locale because:
- Zero dependencies (no moment.js, date-fns, or similar)
- Native browser support in all modern browsers
- Correctly handles Dutch formatting: `€ 1.234,56` and `15-05-2026`
- Alternatives considered: date-fns/locale (adds 8KB), moment.js (deprecated), manual string formatting (error-prone)

### Single utility module
Creating `frontend/src/utils/format.js` with named exports (`formatEuro`, `formatDate`, `formatDateTime`) because:
- Single import point for all components
- Easy to update locale in one place
- Consistent formatting across the entire app

### Components to update
| Component | Euro formatting | Date formatting |
|---|---|---|
| DashboardPage | Account balances, budget amounts, goal targets | Goal target dates |
| AccountList | Balance column | — |
| AccountForm | Balance input display | — |
| BudgetForm | Amount input display | Start/end dates |
| BudgetAlert | Budget amounts | — |
| GoalForm | Target amount input | Target date |
| GoalsPage | Goal amounts | Target dates |
| CsvUpload | Imported/duplicate amounts | Transaction dates |

## Risks / Trade-offs

[Browser locale support] → Mitigation: `Intl` with `nl-NL` is supported in Chrome, Firefox, Safari, and Edge since 2016+; no fallback needed
[Chart tooltips may not respect custom formatters] → Mitigation: Recharts Tooltip accepts a `formatter` prop; pass `formatEuro` explicitly
[Date inputs (type="date") use browser locale] → Mitigation: Display dates in Dutch format but keep `<input type="date">` values in ISO format for browser compatibility