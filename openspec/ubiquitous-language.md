# Ubiquitous Language - Personal Finance Management

This document defines the shared vocabulary used consistently across the codebase, documentation, and team communication for the Personal Finance Management application. Following Domain-Driven Design principles, this language ensures that developers, domain experts, and stakeholders share a common understanding of the domain concepts.

## Maintenance

This is a living document that should be updated as the domain evolves. Whenever a new concept is introduced or an existing concept is refined during development, this document should be updated to reflect the change.

The process for updating the ubiquitous language is:
1. During development, if a new term is used or an existing term is clarified, note the change.
2. During code review or specification review, update this document accordingly.
3. When updating this document, consider whether the change affects any specifications, code, or other documentation.
4. Communicate changes to the team to ensure everyone is using the same vocabulary.

## Core Domain Concepts

### Account
A financial account where money is held or owed. Examples include checking accounts, savings accounts, credit cards, and loans.

**Attributes:**
- Name: Human-readable identifier for the account (e.g., "Primary Checking")
- Type: Classification of the account (checking, savings, credit, investment, loan, cash)
- Balance: Current monetary value in the account
- User: The owner of the account

**Operations:**
- Open/close account (close implemented via delete)
- Deposit/withdraw funds
- Transfer between accounts (planned)

### Transaction
A record of money moving into or out of an account.

**Attributes:**
- Amount: Monetary value (positive for income, negative for expense)
- Date: When the transaction occurred
- Description: Human-readable description of the transaction
- Category: Classification for reporting and budgeting
- Account: The account affected by the transaction
- User: The owner of the transaction

**Operations:**
- Record transaction
- Categorize transaction
- Search/filter transactions

### Category
A classification system for organizing transactions for reporting and budgeting purposes.

**Attributes:**
- Name: Human-readable identifier (e.g., "Groceries", "Salary")
- Type: Whether the category is for income or expense transactions
- Parent: Optional reference to a parent category for hierarchical organization
- User: The owner of the category

**Operations:**
- Create/modify/delete category
- Assign transactions to categories
- View spending/income by category
- Support for hierarchical categories (parent/child)

### Budget
A planned amount of money allocated for spending in a specific category over a defined time period.

**Attributes:**
- Name: Human-readable identifier for the budget
- Amount: Planned monetary limit
- Period: Time period the budget applies to (monthly/yearly)
- Start Date: When the budget period begins
- End Date: When the budget period ends
- Category: The category this budget applies to
- User: The owner of the budget

**Operations:**
- Create/modify/delete budget
- Track spending against budget
- Receive alerts when approaching/exceeding budget

### Savings Goal
A target amount of money to be saved by a specific date for a particular purpose.

**Attributes:**
- Name: Human-readable identifier for the goal (e.g., "Emergency Fund", "Vacation")
- Target Amount: The amount to be saved
- Current Amount: The amount saved so far
- Target Date: The date by which the goal should be achieved
- Description: Optional details about the goal's purpose
- User: The owner of the goal

**Operations:**
- Create/modify/delete savings goal
- Add funds to goal (contribute)
- Track progress toward goal
- Mark goal as complete

### CSV Import
The process of importing financial transaction data from bank statements in CSV format.

**Attributes:**
- Source File: The CSV file containing transaction data
- Date Format: How dates are represented in the CSV
- Amount Format: How monetary values are represented
- Account Mapping: How to identify which account transactions belong to
- Category Mapping: How to categorize imported transactions
- Duplicate Detection: Mechanism to avoid importing existing transactions

**Operations:**
- Parse CSV file
- Validate transaction data
- Detect and skip duplicate transactions
- Import new transactions
- Report import results (successes, duplicates, errors)

### User
A person who uses the application to manage their personal finances.

**Attributes:**
- Email: Unique identifier for login and communication
- Username: Display name within the application
- Hashed Password: Securely stored credentials for authentication
- Is Active: Whether the user account is currently enabled
- Created/Updated Timestamps: Audit trail for account lifecycle

**Operations:**
- Register/login
- Update profile information
- Change password
- Deactivate/delete account

## Relationships and Constraints

- A User owns multiple Accounts
- An Account belongs to one User and contains multiple Transactions
- A Transaction belongs to one User, one Account, and one Category
- A Category belongs to one User and can have multiple Transactions
- A Budget belongs to one User and applies to one Category
- A Savings Goal belongs to one User
- Budgets are reset at the start of each period (monthly/yearly)
- Savings Goals track progress toward a target amount by a target date

## Common Operations

### Record Financial Activity
1. User selects or creates an Account
2. User enters Transaction details (amount, date, description)
3. User selects or creates a Category for the Transaction
4. System records the Transaction and updates Account balance
5. System updates Budget tracking if applicable
6. System updates Savings Goal tracking if applicable

### Review Financial Status
1. User views Account balances and transaction history
2. User reviews Budget status (spent vs. allocated)
3. User reviews Savings Goal progress
4. User generates Reports for tax or planning purposes (planned)

### Import External Data
1. User provides CSV file from bank/financial institution
2. System parses and validates the CSV data
3. System identifies and reports potential duplicates
4. User confirms import of new transactions
5. System records transactions and updates related balances/goals

## Non-Core Concepts (Explicitly Out of Scope)

The following concepts are intentionally NOT part of the core domain for this application:

- Investment Portfolio: Stocks, bonds, mutual funds, etc.
- Tax Preparation: Forms, deductions, tax calculations
- Investment Tracking: Stock prices, dividends, capital gains
- Business Accounting: Invoices, accounts receivable/payable
- Multi-user Collaboration: Shared accounts, joint budgets
- Currency Conversion: Multi-currency accounts and transactions
- Loan Amortization: Detailed payment schedules for loans
- Credit Score Tracking: Monitoring and improving credit scores