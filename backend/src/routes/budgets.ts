import express, { Request, Response } from 'express';
import { query } from '../db';

export function createBudgetsRouter(_db: { query: (sql: string, params?: any[]) => any }): express.Router {
  const router = express.Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const userId = 1;
      const period = _req.query.period as string || 'monthly';
      
      let dateFilter = '';
      if (period === 'monthly') {
        dateFilter = `AND strftime('%Y-%m', date) = strftime('%Y-%m', 'now')`;
      } else if (period === 'yearly') {
        dateFilter = `AND strftime('%Y', date) = strftime('%Y', 'now')`;
      }
      
      const result = await query(
        `SELECT b.id, b.user_id, b.category_id, c.name as category_name, b.limit_amount, b.period, b.created_at,
                COALESCE((SELECT SUM(ABS(t.amount)) FROM transactions t WHERE t.category_id = b.category_id AND t.user_id = b.user_id AND t.type = 'expense' ${dateFilter}), 0) as spent
         FROM budgets b LEFT JOIN categories c ON b.category_id = c.id WHERE b.user_id = ? AND b.period = ?
         ORDER BY b.created_at DESC`,
        [userId, period]
      );
      
      const budgets = (result.rows || []).map((b: any) => ({
        ...b,
        spent: parseFloat(b.spent || '0'),
        remaining: b.limit_amount - parseFloat(b.spent || '0'),
        percentUsed: b.limit_amount > 0 ? (parseFloat(b.spent || '0') / b.limit_amount) * 100 : 0,
      }));
      
      res.json({ budgets });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const { category_id, limit_amount, period } = req.body;
      if (!category_id || !limit_amount || !period) {
        return res.status(400).json({ error: 'category_id, limit_amount, and period are required' });
      }
      const result = await query(
        'INSERT INTO budgets (user_id, category_id, limit_amount, period) VALUES (?, ?, ?, ?) RETURNING *',
        [userId, category_id, limit_amount, period]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { category_id, limit_amount, period } = req.body;
      const result = await query(
        'UPDATE budgets SET category_id = COALESCE(?, category_id), limit_amount = COALESCE(?, limit_amount), period = COALESCE(?, period) WHERE id = ? RETURNING *',
        [category_id, limit_amount, period, id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await query('DELETE FROM budgets WHERE id = ?', [id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}