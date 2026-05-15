# Personal Finance Management Application

A full-stack personal finance management application designed to help users track income, expenses, and budgets. It supports importing bank statements via CSV and automates repetitive financial tasks.

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Technical Requirements](#technical-requirements)
- [Development Workflow](#development-workflow)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Running the Application](#running-the-application)
  - [Testing](#testing)
- [Deployment Options](#deployment-options)
  - [Docker (Recommended)](#docker-recommended)
  - [Local Development](#local-development)
  - [Synology NAS Deployment](#synology-nas-deployment)
- [OpenSpec-Based Development](#openspec-based-development)
- [Architecture Overview](#architecture-overview)
- [Contributing](#contributing)
- [License](#license)
- [Troubleshooting](#troubleshooting)

## Overview

This application provides a centralized system for managing personal finances, including tracking income and expenses, categorizing transactions, setting budgets, and monitoring savings goals. It aims to automate repetitive financial tasks to give users better insights into their financial health.

## Key Features

1. **Transaction Management** - Track income and expenses with categorization for multiple accounts
2. **CSV Import** - Import bank statements in CSV format with duplicate detection
3. **Budget Tracking** - Set and monitor monthly/yearly budgets by category
4. **Savings Goals** - Set saving goals and track progress toward them
5. **Docker Support** - Deploy locally or on Synology NAS

## Technical Requirements

- **Language**: Python (backend)
- **UI**: Material-UI with React (frontend), desktop and mobile responsive
- **Database**: PostgreSQL
- **DevOps**: Docker, docker-compose, GitHub Actions
- **Minimum**: 4GB RAM (for Docker deployment)

## Development Workflow

### Prerequisites

- Node.js (v20.19.0 or higher) and npm
- Python (3.11 or higher) and pip
- Docker and docker-compose
- PostgreSQL (if not using Docker)

### Backend Setup

```bash
# Clone the repository
git clone <repository-url>
cd personal-finance-application/backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables (copy from .env.example)
cp ../.env.example .env
# Edit .env as needed for your environment

# Initialize database (if not using Docker)
# With Docker, this is handled automatically
# For local development without Docker:
#   createdb personalfinance
#   Update DATABASE_URL in .env if needed

# Run database migrations (if using Alembic or similar)
# For now, tables are created on first run

# Start the development server
uvicorn main:app --reload
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Set up environment variables (if needed)
# Create .env file in frontend directory
# REACT_APP_BACKEND_URL=http://localhost:8000

# Start the development server
npm start
```

### Running the Application

With Docker (recommended):
```bash
docker-compose up
```

Then access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Testing

Backend tests:
```bash
cd backend
source venv/bin/activate
pytest
```

Frontend tests:
```bash
cd frontend
npm test
```

## Deployment Options

### Docker (Recommended)

The easiest way to deploy the application is using Docker Compose:

```bash
docker-compose up -d
```

To update to a new version:
```bash
docker-compose pull
docker-compose up -d
```

### Local Development

For development without Docker:
1. Install and configure PostgreSQL
2. Set up backend as described above
3. Set up frontend as described above
4. Start both servers

### Synology NAS Deployment

See [docs/SYNOLOGY-DEPLOYMENT.md](docs/SYNOLOGY-DEPLOYMENT.md) for detailed instructions on deploying to a Synology NAS using Docker.

## OpenSpec-Based Development

This project follows the OpenSpec workflow for spec-driven development:

1. **Propose** (`/opsx-provide`) - Define what changes and why
2. **Design** - Document technical decisions and architecture
3. **Specify** - Create detailed specifications for new/changed capabilities
4. **Plan** (`tasks.md`) - Break down implementation into trackable tasks
5. **Apply** (`/opsx-apply`) - Implement the changes based on tasks
6. **Archive** (`/opsx-archive`) - Archive completed changes and update canonical specifications

The ubiquitous language is maintained in [`openspec/ubiquitous-language.md`](openspec/ubiquitous-language.md) to ensure consistent terminology across the team.

## Architecture Overview

### Tech Stack Separation
- **Backend**: Python/FastAPI in `/backend`
- **Frontend**: React/Material-UI in `/frontend`
- **Database**: PostgreSQL (via Docker Compose)
- **API**: RESTful under `/api/v1` prefix

### Important Directories
- `/backend/app/models/` - SQLAlchemy models
- `/backend/app/routers/` - API endpoint groups
- `/backend/app/schemas/` - Pydantic validation models
- `/openspec/changes/<name>/` - Active OpenSpec change artifacts
- `/openspec/specs/` - Canonical specifications (updated on archive)
- `/openspec/ubiquitous-language.md` - Domain vocabulary

### Key Architectural Decisions
- Monolithic architecture with clear separation of concerns (backend API, frontend UI, database)
- Chose FastAPI for high performance and automatic API documentation
- Chose React with Material-UI for responsive, accessible design
- Chose PostgreSQL for reliable, ACID-compliant data storage
- Docker and docker-compose for consistent environments across development and production

## Contributing

1. Fork the repository
2. Create a feature branch from `main`
3. Create an OpenSpec change: `/opsx-provide "your feature description"`
4. Follow the OpenSpec workflow to propose, design, specify, and plan your changes
5. Implement your changes following the tasks in `tasks.md`
6. Ensure all tests pass
7. Submit a pull request

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) for detailed guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Troubleshooting

### Common Issues

**Backend fails to start**
- Check that the virtual environment is activated: `source venv/bin/activate`
- Verify dependencies are installed: `pip list`
- Check database connection in `.env`
- Ensure PostgreSQL is running (if not using Docker)

**Frontend fails to start**
- Verify Node.js version: `node --version` (should be v20.19.0 or higher)
- Check dependencies are installed: `npm list`
- Ensure backend is running on the expected port (default: 8000)

**Docker issues**
- Ensure Docker daemon is running
- Check that ports 3000, 8000, and 5432 are not already in use
- View logs with: `docker-compose logs -f`
- Rebuild containers if needed: `docker-compose up --build`

**Database connection errors**
- Verify DATABASE_URL in backend/.env
- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check database credentials match those in docker-compose.yml

For further assistance, please open an issue on the GitHub repository.