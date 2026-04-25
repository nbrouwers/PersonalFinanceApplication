import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const router = express.Router();

export function createReportsRouter(pool: Pool): express.Router {
  router.get('/summary', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const { startDate, endDate } = req.query;
      
      const incomeResult = await pool.query(
        `SELECT COALESCE(SUM(amount), 0) as total FROM transactions
         WHERE user_id = $1 AND type = 'income' AND is_deleted = FALSE
         AND date >= $2 AND date <= $3`,
        [userId, startDate || '2026-01-01', endDate || '2026-12-31']
      );
      
      const expenseResult = await pool.query(
        `SELECT COALESCE(SUM(amount), 0) as total FROM transactions
         WHERE user_id = $1 AND type = 'expense' AND is_deleted = FALSE
         AND date >= $2 AND date <= $3`,
        [userId, startDate || '2026-01-01', endDate || '2026-12-31']
      );
      
      const income = parseFloat(incomeResult.rows[0].total);
      const expense = parseFloat(expenseResult.rows[0].total);
      
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

  router.get('/by-category', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const { type = 'expense', startDate, endDate } = req.query;
      
      const result = await pool.query(
        `SELECT c.name, SUM(t.amount) as total
         FROM transactions t
         JOIN categories c ON t.category_id = c.id
         WHERE t.user_id = $1 AND t.type = $2 AND t.is_deleted = FALSE
         AND t.date >= $3 AND t.date <= $4
         GROUP BY c.id, c.name
         ORDER BY total DESC`,
        [userId, type, startDate || '2026-01-01', endDate || '2026-12-31']
      );
      
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}