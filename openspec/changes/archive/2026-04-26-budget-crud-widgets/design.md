## Context

The BudgetList component currently displays read-only budget data with progress bars. Users need to manage (create, edit, delete) budgets directly from the UI.

## Goals / Non-Goals

**Goals:**
- Add "Create Budget" button that opens a modal with form
- Add edit button next to each budget to enable inline editing
- Add delete button with confirmation dialog
- Persist changes to backend API

**Non-Goals:**
- Batch operations (multiple delete)
- Import/export budgets

## Decisions

1. **Modal for create, inline for edit**
   - Use MUI Dialog for creating new budgets
   - Use inline editing (click to edit) for existing budgets
   - Rationale: Consistent with existing UI patterns

2. **Categories from API**
   - Fetch categories from `/api/v1/categories` for dropdown
   - Rationale: Reuse existing endpoint

3. **Optimistic UI updates**
   - Update UI immediately, rollback on error
   - Rationale: Better UX

## Risks / Trade-offs

- **Risk**: Concurrent edits
  - **Mitiation**: Show last-write-wins, acceptable for single-user app
- **Risk**: Form validation
  - **Mitiation**: Use client-side validation for required fields