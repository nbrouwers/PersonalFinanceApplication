## Why

Users who create budget categories may later want to remove them. Currently there is no way to delete categories from the UI.

## What Changes

- Add delete button to category management
- Add confirmation dialog before deletion
- Handle case when category is in use by budgets

## Capabilities

### New Capabilities
- `category-delete`: Delete a category with confirmation

### Modified Capabilities
- None

## Impact

- Frontend: Add delete button to category UI
- Backend: DELETE /categories/:id endpoint (already exists)