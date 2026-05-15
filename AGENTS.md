# Personal Finance Application - Agent Guidelines

## Essential Commands

**Backend Development:**
- Start backend: `cd backend && source venv/bin/activate && uvicorn main:app --reload`
- Run backend tests: `cd backend && source venv/bin/activate && pytest`
- Lint backend: `cd backend && source venv/bin/activate && flake8`

**Frontend Development:**
- Start frontend: `cd frontend && npm start`
- Run frontend tests: `cd frontend && npm test`

**Database & Docker:**
- Start all services: `docker-compose up`
- Stop services: `docker-compose down`
- Rebuild containers: `docker-compose up --build`

**OpenSpec Workflow:**
- Propose change: `/opsx-provide <description>` then follow prompts
- Apply changes: `/opsx-apply`
- Archive change: `/opsx-archive <change-name>`
  Archive commits and pushes to git automatically: `git add -A && git commit -m "Archive: <change-name>" && git push`
- View ubiquitous language: `openspec/ubiquitous-language.md`

## Key Architectural Notes

**Tech Stack Separation:**
- Backend: Python/FastAPI in `/backend`
- Frontend: React/Material-UI in `/frontend`
- Database: PostgreSQL (via Docker Compose)
- API: RESTful under `/api/v1` prefix

**Important Directories:**
- `/backend/app/models/` - SQLAlchemy models
- `/backend/app/routers/` - API endpoint groups
- `/backend/app/schemas/` - Pydantic validation models
- `/openspec/changes/<name>/` - Active OpenSpec change artifacts
- `/openspec/specs/` - Canonical specifications (updated on archive)
- `/openspec/ubiquitous-language.md` - Domain vocabulary (update when domain evolves)

**Gotchas:**
1. Backend requires virtual environment activation (`source venv/bin/activate`)
2. Frontend uses port 3000, backend uses port 8000 (see docker-compose.yml)
3. OpenSpec spec changes require updating both change specs and main specs (on archive)
4. CSV import expects format: date,description,amount,[account_name],[category_name]
5. Tests require setting DATABASE_URL environment variable for backend tests
6. **Ubiquitous language**: Always check and update `openspec/ubiquitous-language.md` when proposing changes that introduce new domain or UI concepts