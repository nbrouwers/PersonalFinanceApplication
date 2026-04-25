import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Pool } from 'pg';
import { createImportRouter } from './routes/import';
import { createTransactionRouter } from './routes/transactions';
import { createCategoryRouter } from './routes/categories';
import { createBudgetRouter } from './routes/budgets';
import { createReportsRouter } from './routes/reports';
import exportRouter from './routes/export';

const app: Application = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/personal_finance',
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/import', createImportRouter(pool));
app.use('/api/v1/transactions', createTransactionRouter(pool));
app.use('/api/v1/categories', createCategoryRouter(pool));
app.use('/api/v1/budgets', createBudgetRouter(pool));
app.use('/api/v1/reports', createReportsRouter(pool));
app.use('/api/v1/export', exportRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;