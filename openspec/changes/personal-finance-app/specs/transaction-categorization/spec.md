## ADDED Requirements

### Requirement: Predefined categories
The system SHALL provide standard transaction categories organized by type (income, expense).

#### Scenario: View available categories
- **WHEN** user views category list
- **THEN** system displays: Income (Salary, Freelance, Investment), Expenses (Groceries, Utilities, Dining, Entertainment, Transportation, Healthcare, Other)

#### Scenario: Use predefined category
- **WHEN** user creates transaction and selects "Groceries" category
- **THEN** system applies that category to transaction

### Requirement: Custom categories
The system SHALL allow users to create custom transaction categories.

#### Scenario: Create custom category
- **WHEN** user creates custom category "Pet Care"
- **THEN** system adds category to user's category list

#### Scenario: Use custom category
- **WHEN** user assigns custom category to transaction
- **THEN** system applies and tracks custom category in reports

#### Scenario: Duplicate custom category
- **WHEN** user attempts to create category with name already in use
- **THEN** system rejects and shows error

### Requirement: Manual categorization
The system SHALL allow users to manually assign or change transaction category.

#### Scenario: Assign category to uncategorized transaction
- **WHEN** user assigns "Dining" category to transaction
- **THEN** system applies category and reflects in budget tracking

#### Scenario: Change transaction category
- **WHEN** user changes category from "Dining" to "Entertainment"
- **THEN** system updates category and recalculates budget impact

### Requirement: Automatic categorization
The system SHALL automatically suggest categories for transactions based on description keywords and merchant name.

#### Scenario: Suggest category by merchant
- **WHEN** transaction description contains "Whole Foods" (grocery merchant)
- **THEN** system suggests "Groceries" category

#### Scenario: Suggest category by keywords
- **WHEN** transaction description contains "coffee" or "lunch"
- **THEN** system suggests "Dining" category

#### Scenario: User accepts suggestion
- **WHEN** system suggests category and user confirms
- **THEN** system learns association for future similar transactions

#### Scenario: User rejects suggestion
- **WHEN** system suggests incorrect category and user assigns different category
- **THEN** system records correction for machine learning model updates

### Requirement: Category rules
The system SHALL allow users to create rules for automatic categorization of future transactions.

#### Scenario: Create keyword rule
- **WHEN** user creates rule "any transaction with 'gym' goes to Entertainment"
- **THEN** system automatically applies Entertainment to future gym transactions

#### Scenario: Create merchant rule
- **WHEN** user creates rule for specific merchant (e.g., Amazon) to Groceries
- **THEN** system applies category to all transactions from that merchant

#### Scenario: Rule priority
- **WHEN** multiple rules could apply to transaction
- **THEN** system applies most specific rule (merchant > keyword)

### Requirement: Bulk categorization
The system SHALL allow users to assign category to multiple transactions at once.

#### Scenario: Select and categorize
- **WHEN** user selects 5 uncategorized transactions and assigns "Groceries"
- **THEN** system applies category to all selected transactions

### Requirement: Uncategorized transaction handling
The system SHALL identify and flag transactions without category assignment.

#### Scenario: List uncategorized
- **WHEN** user views uncategorized transactions
- **THEN** system displays all transactions without assigned category

#### Scenario: Exclude from reporting
- **WHEN** uncategorized transactions exist
- **THEN** system excludes from category-based reports but includes in totals
