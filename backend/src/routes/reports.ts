import express, { Request, Response } from 'express';
import { query } from '../db';

export function createReportsRouter(_db: { query: (sql: string, params?: any[]) => any }): express.Router {
  const router = express.Router();

  router.get('/', async (_req: Request, res: Response) => {
    res.json({ reports: [] });
  });

  router.get('/summary', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const startDate = (req.query.startDate as string) || '2026-01-01';
      const endDate = (req.query.endDate as string) || '2026-12-31';
      
      const incomeResult = await query(
        'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = $2 AND is_deleted = FALSE AND date >= $3 AND date <= $4',
        [userId, 'income', startDate, endDate]
      );
      
      const expenseResult = await query(
        'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = $2 AND is_deleted = FALSE AND date >= $3 AND date <= $4',
        [userId, 'expense', startDate, endDate]
      );
      
      const income = parseFloat(incomeResult.rows[0]?.total || '0');
      const expense = parseFloat(expenseResult.rows[0]?.total || '0');
      
      res.json({
        income,
        expense,
        net: income - expense,
        savingsRate: income > 0 ? ((income - expense) / income) * 100 : 0,
      });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}