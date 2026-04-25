## ADDED Requirements

### Requirement: Backend runs locally without Docker
The system SHALL allow the backend to run directly on the developer's machine using Node.js without requiring Docker containers.

#### Scenario: Start backend with npm
- **WHEN** developer runs `cd backend && npm run dev`
- **THEN** backend server starts on port 3000 and is accessible

#### Scenario: Backend connects to local SQLite
- **WHEN** backend starts without DATABASE_URL pointing to PostgreSQL
- **THEN** system automatically creates and uses local SQLite database file

### Requirement: Frontend runs locally without Docker
The system SHALL allow the frontend to run directly on the developer's machine using npm without requiring Docker containers.

#### Scenario: Start frontend with npm
- **WHEN** developer runs `cd frontend && npm start`
- **THEN** frontend application starts on port 3001 and is accessible in browser

#### Scenario: Frontend connects to local backend
- **WHEN** frontend starts
- **THEN** it connects to backend at http://localhost:3000

### Requirement: Combined startup script
The system SHALL provide a single command to start both backend and frontend.

#### Scenario: Run devall script
- **WHEN** developer runs `npm run devall` from project root
- **THEN** both backend and frontend start in their respective terminals/processes

### Requirement: Local database initialization
The system SHALL automatically create the SQLite database schema on first run without manual setup.

#### Scenario: First run creates database
- **WHEN** backend starts for the first time without existing database
- **THEN** system automatically creates SQLite database file with all required tables

### Requirement: Data persists in local file
The system SHALL store all data in a local SQLite file that persists between restarts.

#### Scenario: Data persists after restart
- **WHEN** developer restarts the application
- **THEN** all previously entered transactions, budgets, and categories are still present