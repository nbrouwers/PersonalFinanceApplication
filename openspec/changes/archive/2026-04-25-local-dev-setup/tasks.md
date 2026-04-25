## 1. Add SQLite Dependencies

- [x] 1.1 Add better-sqlite3 to backend dependencies
- [x] 1.2 Add knex (SQL query builder) to backend dependencies
- [x] 1.3 Install all new dependencies

## 2. Update Database Layer

- [x] 2.1 Create database connection that detects SQLite vs PostgreSQL
- [x] 2.2 Create SQLite schema file (translated from PostgreSQL)
- [x] 2.3 Update pool.ts to use Knex for queries

## 3. Update Backend Configuration

- [x] 3.1 Update index.ts to auto-initialize SQLite database
- [x] 3.2 Add automatic schema creation on first run
- [x] 3.3 Configure SQLite database file location

## 4. Update Frontend Configuration

- [x] 4.1 Update API URL to point to localhost
- [x] 4.2 Remove Docker-specific environment configs

## 5. Update Root package.json

- [x] 5.1 Add devall script to run both frontend and backend
- [x] 5.2 Update workspaces if needed

## 6. Update Dependencies Files

- [x] 6.1 Create .gitignore for SQLite database files
- [x] 6.2 Add local SQLite file to .gitignore

## 7. Test Local Execution

- [x] 7.1 Run backend with npm run dev
- [x] 7.2 Run frontend with npm start
- [x] 7.3 Test full workflow (create transaction, view dashboard, export)

## 8. Update Documentation

- [x] 8.1 Add local setup instructions to README
- [x] 8.2 Document SQLite vs PostgreSQL differences