## ADDED Requirements

### Requirement: User can view all categories in dropdown
The system SHALL display all available categories in the category dropdown without any limit.

#### Scenario: Show all categories
- **WHEN** user opens category dropdown
- **THEN** all expense categories are shown

### Requirement: User can create category from budget dialog
The system SHALL allow users to create a new category without leaving the budget dialog.

#### Scenario: Create new category from dropdown
- **WHEN** user selects "Create new category" option
- **THEN** inline text field appears for category name

#### Scenario: Save new category
- **WHEN** user enters name and saves
- **THEN** category is created and selected

### Requirement: Category list shows expense types only
The system SHALL filter categories to show expense types when creating budgets.

#### Scenario: Filter to expense types
- **WHEN** budget dialog fetches categories
- **THEN** only categories with type='expense' are shown