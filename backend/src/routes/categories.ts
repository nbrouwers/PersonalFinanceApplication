import express, { Request, Response } from 'express';

export function createCategoriesRouter(db: { query: (sql: string, params?: any[]) => any }): express.Router {
  const router = express.Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const userId = 1;
      const typeFilter = _req.query.type ? ` AND type = '${_req.query.type}'` : '';
      const result = await db.query(
        `SELECT MIN(id) as id, user_id, name, type, is_default, MIN(created_at) as created_at FROM categories WHERE (user_id IS NULL OR user_id = ?)${typeFilter} GROUP BY name, type ORDER BY type, name`,
        [userId]
      );
      res.json(result.rows || []);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const { name, type } = req.body;
      if (!name || !type) return res.status(400).json({ error: 'Name and type are required' });
      if (!['income', 'expense'].includes(type)) return res.status(400).json({ error: 'Type must be income or expense' });
      
      const result = await db.query(
        `INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?) RETURNING *`,
        [userId, name, type]
      );
      res.status(201).json(result.rows?.[0]);
    } catch (err) {
      if ((err as any).code === '23505') return res.status(400).json({ error: 'Category already exists' });
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const result = await db.query(`UPDATE categories SET name = ? WHERE id = ? RETURNING *`, [name, id]);
      if (!result.rows?.length) return res.status(404).json({ error: 'Category not found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await db.query(`DELETE FROM categories WHERE id = ? AND is_default = 0 RETURNING *`, [id]);
      if (!result.rows?.length) return res.status(404).json({ error: 'Category not found or cannot be deleted' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}

export function createBudgetRouter(db: { query: (sql: string, params?: any[]) => any }): express.Router {
  const router = express.Router();

  router.get('/', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const result = await db.query(
        `SELECT b.*, c.name as category_name FROM budgets b LEFT JOIN categories c ON b.category_id = c.id WHERE b.user_id = ?`,
        [userId]
      );
      const budgets = (result.rows || []).map((b: any) => ({
        ...b,
        limit_amount: b.limit_amount,
        spent: 0,
        remaining: b.limit_amount,
        percentUsed: 0
      }));
      res.json(budgets);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const { categoryId, limitAmount, period } = req.body;
      if (!limitAmount || !period) return res.status(400).json({ error: 'Limit amount and period are required' });
      
      const result = await db.query(
        `INSERT INTO budgets (user_id, category_id, limit_amount, period) VALUES (?, ?, ?, ?) RETURNING *`,
        [userId, categoryId, limitAmount, period]
      );
      res.status(201).json(result.rows?.[0]);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { categoryId, limitAmount, period } = req.body;
      const result = await db.query(
        `UPDATE budgets SET category_id = COALESCE(?, category_id), limit_amount = COALESCE(?, limit_amount), period = COALESCE(?, period), updated_at = datetime('now') WHERE id = ? AND user_id = ? RETURNING *`,
        [categoryId, limitAmount, period, id, 1]
      );
      if (!result.rows?.length) return res.status(404).json({ error: 'Budget not found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await db.query(`DELETE FROM budgets WHERE id = ? AND user_id = ? RETURNING *`, [id, 1]);
      if (!result.rows?.length) return res.status(404).json({ error: 'Budget not found' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}

export function createReportsRouter(db: { query: (sql: string, params?: any[]) => any }): express.Router {
  const router = express.Router();

  router.get('/summary', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const { startDate = '2026-01-01', endDate = '2026-12-31' } = req.query;
      
      const incomeResult = await db.query(`SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = ? AND type = 'income' AND is_deleted = 0 AND date >= ? AND date <= ?`, [userId, startDate, endDate]);
      const expenseResult = await db.query(`SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = ? AND type = 'expense' AND is_deleted = 0 AND date >= ? AND date <= ?`, [userId, startDate, endDate]);
      
      const income = parseFloat(incomeResult.rows?.[0]?.total || 0);
      const expense = parseFloat(expenseResult.rows?.[0]?.total || 0);
      
      res.json({ income, expense, net: income - expense, savingsRate: income > 0 ? ((income - expense) / income) * 100 : 0 });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.get('/by-category', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const { type = 'expense', startDate = '2026-01-01', endDate = '2026-12-31' } = req.query;
      
      const result = await db.query(
        `SELECT c.name, SUM(t.amount) as total FROM transactions t JOIN categories c ON t.category_id = c.id WHERE t.user_id = ? AND t.type = ? AND t.is_deleted = 0 AND t.date >= ? AND t.date <= ? GROUP BY c.id, c.name ORDER BY total DESC`,
        [userId, type, startDate, endDate]
      );
      res.json(result.rows || []);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}