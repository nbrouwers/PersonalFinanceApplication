import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const router = express.Router();

export function createBudgetRouter(pool: Pool): express.Router {
  router.get('/', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      
      const result = await pool.query(
        `SELECT b.*, c.name as category_name,
                COALESCE(
                  (SELECT SUM(t.amount) FROM transactions t 
                   WHERE t.category_id = b.category_id AND t.user_id = b.user_id 
                   AND t.type = 'expense' AND t.is_deleted = FALSE
                   AND t.date >= date_trunc('month', CURRENT_DATE)
                   AND t.date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'),
                  0
                ) as spent
         FROM budgets b
         LEFT JOIN categories c ON b.category_id = c.id
         WHERE b.user_id = $1`,
        [userId]
      );
      
      res.json(result.rows.map(row => ({
        ...row,
        remaining: row.limit_amount - parseFloat(row.spent),
        percentUsed: (parseFloat(row.spent) / parseFloat(row.limit_amount)) * 100,
      })));
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const { categoryId, limitAmount, period } = req.body;
      
      if (!limitAmount || !period) {
        return res.status(400).json({ error: 'Limit amount and period are required' });
      }
      
      if (!['monthly', 'yearly'].includes(period)) {
        return res.status(400).json({ error: 'Period must be monthly or yearly' });
      }
      
      const result = await pool.query(
        `INSERT INTO budgets (user_id, category_id, limit_amount, period)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [userId, categoryId, limitAmount, period]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { categoryId, limitAmount, period } = req.body;
      
      const result = await pool.query(
        `UPDATE budgets 
         SET category_id = COALESCE($3, category_id),
             limit_amount = COALESCE($4, limit_amount),
             period = COALESCE($5, period),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [id, 1, categoryId, limitAmount, period]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Budget not found' });
      }
      
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        `DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING *`,
        [id, 1]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Budget not found' });
      }
      
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}