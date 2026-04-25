## Why

Users currently cannot create, update, or delete budgets through the UI. The budget features are read-only without a way to manage budget limits interactively.

## What Changes

- Add "Create Budget" dialog/modal with category selection, amount input, and period (monthly/yearly)
- Add inline editing for existing budgets
- Add delete confirmation dialog
- Add visual progress bars showing spent vs. limit

## Capabilities

### New Capabilities
- `budget-create`: Form to create new budgets with category, amount, and period
- `budget-edit`: Inline editing to modify existing budgets
- `budget-delete`: Delete budget with confirmation

### Modified Capabilities
- None

## Impact

- Frontend: New components in `frontend/src/components/`
- Backend: Update `budgets` table and API routes