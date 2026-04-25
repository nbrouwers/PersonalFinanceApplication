## Why

When creating a budget, users can only select from existing categories. If the desired category doesn't exist, they must go to a separate screen to create it, then return to create the budget. This creates friction in the workflow.

## What Changes

- Enable "Add new category" option in category dropdown
- Show inline form to create category without leaving the budget dialog
- Auto-select newly created category after creation
- Increase category list to show all categories (not limited to 6)

## Capabilities

### New Capabilities
- `category-create-inline`: Create category from within budget dialog
- `category-list-all`: Show all categories in dropdown (not paginated)

### Modified Capabilities
- `budget-crud`: Modified to support inline category creation

## Impact

- Frontend: Update BudgetDialog component
- API: No changes needed (POST /categories already exists)