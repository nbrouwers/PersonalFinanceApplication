## Context

Categories are created in the budget dialog but there's no way to delete them. The backend has DELETE endpoint, but UI doesn't expose it.

## Goals / Non-Goals

**Goals:**
- Add delete option for each category in a category management screen
- Show confirmation dialog before deletion
- Handle budgets referencing the category

**Non-Goals:**
- Bulk delete categories
- Category editing (not in scope)

## Decisions

1. **Add delete button next to each category**
   - Reuse existing confirmation dialog pattern from budget delete
   - Rationale: Consistent with app patterns

2. **Check for budgets using category**
   - Before delete, check if category is used by any budgets
   - If used, show warning and block delete, or set category to null
   - Rationale: Prevent orphaned data - simpler to warn

## Risks / Trade-offs

- **Risk**: Deleting category with budgets
  - **Mitigation**: Show warning, don't allow deletion
- **Risk**: Deleting default categories
  - **Mitiation**: Allow deletion, user-created categories should be removable