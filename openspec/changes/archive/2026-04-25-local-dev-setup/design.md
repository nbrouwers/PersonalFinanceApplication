## Context

The current application requires Docker Desktop, docker-compose, and potentially Docker Desktop for Mac/Windows. This adds overhead for developers who just want to make quick code changes and test them. The goal is enabling the application to run directly on the developer's machine with minimal setup.

**Current State**: Application runs only with Docker
**Target State**: Application runs directly with Node.js

## Goals / Non-Goals

**Goals:**
- Enable backend to run with `npm run dev` without Docker
- Enable frontend to run with `npm start` without Docker
- Use SQLite as local database (file-based, zero configuration)
- Maintain identical API interface
- Create simple startup scripts

**Non-Goals:**
- Replace PostgreSQL for production (production still uses PostgreSQL)
- Modify application functionality
- Change deployment process for production

## Decisions

### 1. Database: SQLite over PostgreSQL for local
**Decision:** Use better-sqlite3 for local development
**Rationale:** Zero configuration, file-based, no external dependencies
**Alternatives Considered:**
- PostgreSQL local install: Requires user to install and configure PostgreSQL
- Docker for database only: Still requires Docker

### 2. Data Access: ORM abstraction
**Decision:** Use Knex.js with SQLite driver
**Rationale:** Knex can use SQLite for dev and PostgreSQL for production with minimal code changes
**Alternatives Considered:**
- Direct SQL queries: More code changes to maintain
- TypeORM: Heavier than needed for this use case

### 3. Startup: Combined script vs separate terminals
**Decision:** Create a single `npm run devall` script that starts both backend and frontend
**Rationale:** Single command convenience for developers
**Alternatives Considered:**
- Separate terminals: User needs two terminal windows

### 4. Port Configuration
**Decision:** Use same ports (3000 backend, 3001 frontend)
**Rationale:** Avoids confusion, matches Docker setup

## Risks / Trade-offs

[Risk: SQLite dialect differences] → Use Knex query builder to abstract SQL differences

[Risk: Application behavior differences between SQLite/PostgreSQL] → Use identical API layer; data types are normalized

[Risk: User confusion on which database to use] → Document clearly: dev uses SQLite, production uses PostgreSQL

[Risk: Lost data when switching between database types] → Each user maintains their own local SQLite file; no shared data

## Migration Plan

1. Install new dependencies (knex, better-sqlite3)
2. Modify database connection to check DATABASE_URL
3. Create SQLite schema (auto-created on first run)
4. Add startup scripts
5. Update README with local setup instructions

## Open Questions

None - requirements are clear from the proposal.