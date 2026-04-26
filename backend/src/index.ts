import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initDatabase, query, close } from './db';
import { createImportRouter } from './routes/import';
import { createTransactionRouter } from './routes/transactions';
import { createCategoriesRouter } from './routes/categories';
import { createBudgetsRouter } from './routes/budgets';
import { createReportsRouter } from './routes/reports';
import { createAccountsRouter } from './routes/accounts';
import exportRouter from './routes/export';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initDatabase();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes using db.query() abstraction
app.use('/api/v1/import', createImportRouter({ query } as any));
app.use('/api/v1/transactions', createTransactionRouter({ query } as any));
app.use('/api/v1/categories', createCategoriesRouter({ query } as any));
app.use('/api/v1/budgets', createBudgetsRouter({ query } as any));
app.use('/api/v1/reports', createReportsRouter({ query } as any));
app.use('/api/v1/accounts', createAccountsRouter({ query } as any));
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

export { query, close };