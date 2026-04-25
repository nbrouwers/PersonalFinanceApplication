# Personal Finance Application

A full-stack personal finance management application for tracking income, expenses, budgets, and generating financial reports. Supports CSV import from bank statements and data export.

## Features

- **Transaction Management** - Track income and expenses with categories
- **CSV Import** - Import bank statements with automatic duplicate detection
- **Budget Tracking** - Set monthly/yearly budgets by category
- **Financial Reports** - Summary, category analysis, YTD, tax reports
- **Data Export** - Export to CSV or JSON
- **Docker Ready** - Deploy locally or on Synology NAS

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, Material-UI
- **Database**: PostgreSQL
- **DevOps**: Docker, docker-compose

## Quick Start (Docker)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (Windows/Mac) or Docker engine (Linux)
- 4GB RAM available

### Run with Docker Compose

```bash
# Clone the repository
git clone https://github.com/nbrouwers/PersonalFinanceApplication.git
cd PersonalFinanceApplication

# Start all services
cd docker && docker-compose up -d

# Wait for services to start (~30 seconds)
```

Then open:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000

### Stop Services

```bash
cd docker && docker-compose down
```

## Quick Start (Local - No Docker)

### Prerequisites

- Node.js 20+
- npm or yarn

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd frontend && npm install
```

### 2. Create Data Directory

The SQLite database is stored relative to the backend directory. Create the data folder inside `backend/`:

```bash
mkdir -p backend/data
```

### 3. Start Backend

```bash
cd backend && npm run dev
```

### 4. Start Frontend (new terminal)

```bash
cd frontend && npm start
```

Open http://localhost:3001

### Quick Start (Both at Once)

```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend  
cd frontend && npm start
```

## Quick Start (Development)

### Prerequisites

- Node.js 20+
- npm or yarn
- PostgreSQL 15+

### 1. Set Up Database

```bash
# Start PostgreSQL (or use Docker)
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=personal_finance \
  postgres:15-alpine

# Create tables
psql -h localhost -U postgres -d personal_finance -f backend/src/db/schema.sql
```

### 2. Set Up Backend

```bash
cd backend
npm install

# Create .env file
cat > .env <<EOF
DATABASE_URL=postgresql://postgres:password@localhost:5432/personal_finance
NODE_ENV=development
PORT=3000
EOF

# Run development server
npm run dev
```

### 3. Set Up Frontend

```bash
# In another terminal
cd frontend
npm install
npm start
```

Open http://localhost:3001

## Usage

### Adding Transactions

1. Click "Transactions" tab
2. Click "+" to add new transaction
3. Enter amount, date, description, category
4. Save

### Importing CSV from Bank

1. Click "Import" tab
2. Select CSV file from your bank
3. Review preview
4. Click "Import"

**Supported formats**: Chase, Bank of America, Wells Fargo, generic CSV

### Managing Budgets

1. Click "Budgets" tab
2. Click "Create Budget"
3. Select category, amount, period (monthly/yearly)
4. View progress bars

### Exporting Data

1. Use Export menu on any page
2. Choose CSV or JSON format
3. File downloads automatically

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/transactions` | GET, POST | List/Create transactions |
| `/api/v1/transactions/:id` | GET, PUT, DELETE | Single transaction |
| `/api/v1/budgets` | GET, POST | List/Create budgets |
| `/api/v1/categories` | GET, POST | List/Create categories |
| `/api/v1/import/preview` | POST | Preview CSV file |
| `/api/v1/import/confirm` | POST | Confirm import |
| `/api/v1/reports/summary` | GET | Financial summary |
| `/api/v1/reports/by-category` | GET | Category breakdown |
| `/api/v1/export/transactions` | GET | Export transactions |

## Deployment

### Synology NAS

See [docker/SYNOLOGY_DEPLOY.md](docker/SYNOLOGY_DEPLOY.md) for detailed instructions.

```bash
# Transfer files to NAS
scp -r ./backend ./frontend ./docker user@nas:/volume1/docker/personal-finance/

# SSH and start
ssh user@nas
cd /volume1/docker/personal-finance/docker
docker-compose up -d
```

### Production

Update `docker/docker-compose.yml` with production values:

```yaml
environment:
  - NODE_ENV=production
  - DATABASE_URL=postgresql://user:password@db:5432/personal_finance
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | (required) | PostgreSQL connection string |
| `PORT` | 3000 | Backend port |
| `NODE_ENV` | development | Environment |

### Database Schema

Tables created automatically:
- `users` - User accounts
- `accounts` - Bank accounts
- `transactions` - Income/expenses
- `categories` - Transaction categories
- `budgets` - Budget limits
- `import_history` - Import tracking

## Development

### Run Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Build for Production

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

## Troubleshooting

### "Connection refused" error

- Check PostgreSQL is running: `docker ps`
- Verify DATABASE_URL format

### Import fails

- Ensure CSV has Date and Amount columns
- Check for duplicate transactions

### Port already in use

- Stop other services using ports 3000, 3001, 5432
- Or modify ports in docker-compose.yml

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## Support

For issues or questions, create a GitHub issue.