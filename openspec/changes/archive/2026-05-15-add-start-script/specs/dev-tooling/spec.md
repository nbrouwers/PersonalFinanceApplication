## ADDED Requirements

### Requirement: Local development startup script
The system SHALL provide a single startup script that launches both backend and frontend for local development.

#### Scenario: Clean start kills stale processes
- **WHEN** the script runs and existing processes are using ports 8000 or 3000
- **THEN** those processes are terminated before new ones start

#### Scenario: Both services start successfully
- **WHEN** the script runs with no port conflicts
- **THEN** the backend starts on port 8000 and the frontend starts on port 3000, both producing visible output