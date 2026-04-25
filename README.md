# Personal Finance Application

A full-stack personal finance management application built with Node.js, Express, React, and PostgreSQL.

## Features

- Transaction tracking (income/expenses)
- CSV import from bank statements with duplicate detection
- Budget management with category tracking
- Financial reporting and analytics
- Data export (CSV, JSON)
- Docker containerization (Synology NAS compatible)

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **Frontend**: React, TypeScript, Material-UI
- **DevOps**: Docker, docker-compose

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & docker-compose
- PostgreSQL 15+

### Local Development

```bash
# Start database and Redis
cd docker && docker-compose up -d db cache

# Install backend dependencies
cd backend && npm install

# Start backend
npm run dev

# Install frontend dependencies (new terminal)
cd frontend && npm install

# Start frontend
npm start
```

### Using Docker

```bash
cd docker && docker-compose up -d
```

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Database: localhost:5432

## API Endpoints

### Transactions
- `GET /api/v1/transactions` - List transactions
- `POST /api/v1/transactions` - Create transaction
- `GET /api/v1/transactions/:id` - Get transaction
- `PUT /api/v1/transactions/:id` - Update transaction
- `DELETE /api/v1/transactions/:id` - Delete transaction

### Budgets
- `GET /api/v1/budgets` - List budgets
- `POST /api/v1/budgets` - Create budget
- `PUT /api/v1/budgets/:id` - Update budget
- `DELETE /api/v1/budgets/:id` - Delete budget

### Import
- `POST /api/v1/import/preview` - Preview CSV
- `POST /api/v1/import/confirm` - Confirm import
- `GET /api/v1/import/history` - Import history

### Export
- `GET /api/v1/export/transactions` - Export transactions
- `GET /api/v1/export/budgets` - Export budgets

### Reports
- `GET /api/v1/reports/summary` - Summary report
- `GET /api/v1/reports/by-category` - Category breakdown

## Deployment

See `docker/SYNOLOGY_DEPLOY.md` for Synology NAS deployment.

## License

MIT