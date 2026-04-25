## Context

The BudgetDialog currently shows a category dropdown limited to 6 items. The API returns all categories but the UI uses MUI Select which may be truncating. Users cannot create a new category from the dialog.

## Goals / Non-Goals

**Goals:**
- Show all categories in dropdown (remove 6-item limit)
- Add "Create new category" option at bottom of dropdown
- Show inline form when "Create new category" is selected
- Auto-select newly created category after saving

**Non-Goals:**
- Modify category management screen
- Add category types other than expense (scope to budget use case)

## Decisions

1. **Use "Create new" as special menu item**
   - Add as last option in Select dropdown
   - Opens inline text field for new category name
   - Rationale: Consistent with MUI patterns

2. **Fetch without pagination**
   - Remove any limit on categories API call
   - Rationale: Current dataset is small (<100 categories)

3. **Create category via existing endpoint**
   - Use POST /api/v1/categories
   - Rationale: Reuse existing API

## Risks / Trade-offs

- **Risk**: Category name conflicts
  - **Mitigation**: Show error if category already exists
- **Risk**: Form state management
  - **Mitiation**: Clear form on category save, pre-select new category