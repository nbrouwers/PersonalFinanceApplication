## ADDED Requirements

### Requirement: User can delete a category
The system SHALL allow users to delete a category with confirmation.

#### Scenario: Delete category with confirmation
- **WHEN** user clicks delete and confirms
- **THEN** category is removed from database

#### Scenario: Delete category in use by budgets
- **WHEN** user tries to delete category assigned to budgets
- **THEN** system shows warning and prevents deletion