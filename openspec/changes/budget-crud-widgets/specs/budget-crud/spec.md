## ADDED Requirements

### Requirement: User can create a budget
The system SHALL allow users to create a new budget with category, amount, and period.

#### Scenario: Create budget with valid data
- **WHEN** user clicks "Create Budget", fills form, and clicks "Save"
- **THEN** system creates budget and displays it in the list

#### Scenario: Create budget with missing required fields
- **WHEN** user clicks "Save" without filling required fields
- **THEN** system displays validation errors

### Requirement: User can edit a budget
The system SHALL allow users to modify an existing budget.

#### Scenario: Edit budget amount
- **WHEN** user clicks edit, changes amount, and saves
- **THEN** system updates the budget

### Requirement: User can delete a budget
The system SHALL allow users to remove a budget with confirmation.

#### Scenario: Delete budget with confirmation
- **WHEN** user clicks delete and confirms
- **THEN** system removes budget from list

#### Scenario: Delete budget and cancel
- **WHEN** user clicks delete but cancels
- **THEN** system keeps budget