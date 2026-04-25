import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const router = express.Router();

export function createCategoryRouter(pool: Pool): express.Router {
  router.get('/', async (_req: Request, res: Response) => {
    try {
      const userId = 1; // default user
      
      const result = await pool.query(
        `SELECT * FROM categories WHERE user_id IS NULL OR user_id = $1 ORDER BY type, name`,
        [userId]
      );
      
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const { name, type } = req.body;
      
      if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
      }
      
      if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ error: 'Type must be income or expense' });
      }
      
      const result = await pool.query(
        `INSERT INTO categories (user_id, name, type) VALUES ($1, $2, $3) RETURNING *`,
        [userId, name, type]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (err) {
      if ((err as any).code === '23505') {
        return res.status(400).json({ error: 'Category already exists' });
      }
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      const result = await pool.query(
        `UPDATE categories SET name = $2 WHERE id = $1 RETURNING *`,
        [id, name]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
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
        `DELETE FROM categories WHERE id = $1 AND is_default = FALSE RETURNING *`,
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found or cannot be deleted' });
      }
      
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.get('/rules', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const result = await pool.query(
        `SELECT * FROM category_rules WHERE user_id = $1 ORDER BY type, keyword`,
        [userId]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.post('/rules', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const { keyword, categoryId, type } = req.body;
      
      if (!keyword || !categoryId) {
        return res.status(400).json({ error: 'keyword and categoryId are required' });
      }
      
      const result = await pool.query(
        `INSERT INTO category_rules (user_id, keyword, category_id, type) VALUES ($1, $2, $3, $4) RETURNING *`,
        [userId, keyword, categoryId, type || 'keyword']
      );
      
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.delete('/rules/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await pool.query(`DELETE FROM category_rules WHERE id = $1`, [id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.post('/bulk', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const { transactionIds, categoryId } = req.body;
      
      if (!transactionIds || !Array.isArray(transactionIds) || !categoryId) {
        return res.status(400).json({ error: 'transactionIds array and categoryId required' });
      }
      
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        for (const txId of transactionIds) {
          await client.query(
            `UPDATE transactions SET category_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3`,
            [categoryId, txId, userId]
          );
        }
        await client.query('COMMIT');
        res.json({ success: true, updated: transactionIds.length });
      } finally {
        client.release();
      }
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}