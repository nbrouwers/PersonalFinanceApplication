import express, { Request, Response } from 'express';
import { query } from '../db';

export function createAccountsRouter(_db: { query: (sql: string, params?: any[]) => any }): express.Router {
  const router = express.Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const userId = 1;
      const result = await query(
        'SELECT * FROM accounts WHERE user_id = ? AND is_active = 1 ORDER BY name',
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
      const { name, iban, type, balance } = req.body;
      if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
      }
      const result = await query(
        'INSERT INTO accounts (user_id, name, iban, type, balance) VALUES (?, ?, ?, ?, ?) RETURNING *',
        [userId, name, iban || null, type, balance || 0]
      );
      res.status(201).json(result.rows?.[0]);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await query('SELECT * FROM accounts WHERE id = ?', [id]);
      res.json(result.rows?.[0] || null);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}