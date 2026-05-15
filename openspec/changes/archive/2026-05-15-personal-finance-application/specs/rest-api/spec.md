## ADDED Requirements

### Requirement: Create RESTful API endpoints for all major application functions
The system SHALL provide a RESTful API that allows clients to interact with the application's core functionalities.

#### Scenario: Access accounts endpoint
- **WHEN** client sends a GET request to /api/accounts
- **THEN** system returns a list of all accounts in JSON format

#### Scenario: Create a new transaction via API
- **WHEN** client sends a POST request to /api/transactions with valid transaction data
- **THEN** system creates the transaction and returns the created transaction with ID

#### Scenario: Update budget via API
- **WHEN** client sends a PUT request to /api/budgets/{id} with updated budget data
- **THEN** system updates the budget and returns the updated budget

#### Scenario: Delete a savings goal via API
- **WHEN** client sends a DELETE request to /api/goals/{id}
- **THEN** system deletes the savings goal and returns a success message

#### Scenario: Import CSV via API
- **WHEN** client sends a POST request to /api/import with a CSV file
- **THEN** system processes the CSV and returns the number of imported transactions and duplicates found

#### Scenario: Generate report via API
- **WHEN** client sends a GET request to /api/reports/{type} with parameters
- **THEN** system generates the requested report and returns it in the requested format (JSON or CSV)