## Why

The Personal Finance Application currently requires Docker to run, which creates barriers for developers who want to quickly test changes without setting up containerized environments. Many developers prefer running applications directly on their local machine for easier debugging, inspection, and iteration. This change enables running the full stack locally without Docker.

## What Changes

- Remove Docker dependency for local development
- Enable direct Node.js execution for backend and frontend
- Add local database setup using better-sqlite3 (file-based, no external database required)
- Create simplified startup scripts
- Add instructions for running without Docker

## Capabilities

### New Capabilities
- `local-execution`: Run application directly on local machine without Docker containerization
- `sqlite-database`: Use file-based SQLite database for local development

### Modified Capabilities
- None - this is a new setup variation for development

## Impact

- Backend can run with `npm run dev` directly
- Frontend can run with `npm start` directly  
- Database uses SQLite file instead of PostgreSQL
- No Docker required for development workflow