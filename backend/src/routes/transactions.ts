import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const router = express.Router();

export function createTransactionRouter(pool: Pool): express.Router {
  router.get('/', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId || 1;
      const { page = '1', limit = '20', startDate, endDate, categoryId, type } = req.query;
      
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      let queryStr = `SELECT t.*, c.name as category_name 
                     FROM transactions t 
                     LEFT JOIN categories c ON t.category_id = c.id 
                     WHERE t.user_id = $1 AND t.is_deleted = FALSE`;
      const params: any[] = [userId];
      let paramIdx = 2;
      
      if (startDate) {
        queryStr += ` AND t.date >= $${paramIdx++}`;
        params.push(startDate);
      }
      if (endDate) {
        queryStr += ` AND t.date <= $${paramIdx++}`;
        params.push(endDate);
      }
      if (categoryId) {
        queryStr += ` AND t.category_id = $${paramIdx++}`;
        params.push(categoryId);
      }
      if (type) {
        queryStr += ` AND t.type = $${paramIdx++}`;
        params.push(type);
      }
      
      queryStr += ` ORDER BY t.date DESC LIMIT $${paramIdx++} OFFSET $${paramIdx}`;
      params.push(parseInt(limit as string), offset);
      
      const result = await pool.query(queryStr, params);
      
      res.json({
        transactions: result.rows,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId || 1;
      const { id } = req.params;
      
      const result = await pool.query(
        `SELECT t.*, c.name as category_name 
         FROM transactions t 
         LEFT JOIN categories c ON t.category_id = c.id 
         WHERE t.id = $1 AND t.user_id = $2 AND t.is_deleted = FALSE`,
        [id, userId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      
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
      
      const result = await pool.query(
        `INSERT INTO transactions (user_id, account_id, category_id, amount, type, description, date, currency)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [userId, accountId, categoryId, amount, type, description, date, currency || 'USD']
      );
      
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId || 1;
      const { id } = req.params;
      const { categoryId, amount, description, date } = req.body;
      
      const result = await pool.query(
        `UPDATE transactions 
         SET category_id = COALESCE($3, category_id),
             amount = COALESCE($4, amount),
             description = COALESCE($5, description),
             date = COALESCE($6, date),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE
         RETURNING *`,
        [id, userId, categoryId, amount, description, date]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId || 1;
      const { id } = req.params;
      
      const result = await pool.query(
        `UPDATE transactions SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE RETURNING *`,
        [id, userId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}