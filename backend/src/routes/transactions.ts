import express, { Request, Response } from 'express';

const router = express.Router();

// Simple wrapper that works with both SQLite and PostgreSQL
export function createTransactionRouter(db: { query: (sql: string, params?: any[]) => any }): express.Router {
  router.get('/', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId || 1;
      const { page = '1', limit = '20', startDate, endDate, categoryId, type } = req.query;
      
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      let queryStr = `SELECT t.*, c.name as category_name 
                     FROM transactions t 
                     LEFT JOIN categories c ON t.category_id = c.id 
                     WHERE t.user_id = ? AND t.is_deleted = 0`;
      const params: any[] = [userId];
      
      if (startDate) { queryStr += ` AND t.date >= ?`; params.push(startDate); }
      if (endDate) { queryStr += ` AND t.date <= ?`; params.push(endDate); }
      if (categoryId) { queryStr += ` AND t.category_id = ?`; params.push(categoryId); }
      if (type) { queryStr += ` AND t.type = ?`; params.push(type); }
      
      queryStr += ` ORDER BY t.date DESC LIMIT ? OFFSET ?`;
      params.push(parseInt(limit as string), offset);
      
      const result = await db.query(queryStr, params);
      const rows = result.rows || [];
      
      res.json({ transactions: rows, page: parseInt(page as string), limit: parseInt(limit as string) });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId || 1;
      const { id } = req.params;
      
      const result = await db.query(
        `SELECT t.*, c.name as category_name FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE t.id = ? AND t.user_id = ? AND t.is_deleted = 0`,
        [id, userId]
      );
      
      if (!result.rows?.length) return res.status(404).json({ error: 'Transaction not found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId || 1;
      const { accountId, categoryId, amount, type, description, date, currency } = req.body;
      
      if (!accountId || !amount || !type || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const result = await db.query(
        `INSERT INTO transactions (user_id, account_id, category_id, amount, type, description, date, currency) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
        [userId, accountId, categoryId, amount, type, description, date, currency || 'USD']
      );
      
      res.status(201).json(result.rows?.[0] || result.rows);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId || 1;
      const { id } = req.params;
      const { categoryId, amount, description, date } = req.body;
      
      const result = await db.query(
        `UPDATE transactions SET category_id = COALESCE(?, category_id), amount = COALESCE(?, amount), description = COALESCE(?, description), date = COALESCE(?, date), updated_at = datetime('now') WHERE id = ? AND user_id = ? AND is_deleted = 0 RETURNING *`,
        [categoryId, amount, description, date, id, userId]
      );
      
      if (!result.rows?.length) return res.status(404).json({ error: 'Transaction not found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId || 1;
      const { id } = req.params;
      
      const result = await db.query(
        `UPDATE transactions SET is_deleted = 1, updated_at = datetime('now') WHERE id = ? AND user_id = ? AND is_deleted = 0 RETURNING *`,
        [id, userId]
      );
      
      if (!result.rows?.length) return res.status(404).json({ error: 'Transaction not found' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}