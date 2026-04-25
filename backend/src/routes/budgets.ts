import express, { Request, Response } from 'express';

export function createBudgetsRouter(_db: { query: (sql: string, params?: any[]) => any }): express.Router {
  const router = express.Router();

  router.get('/', async (_req: Request, res: Response) => {
    res.json({ budgets: [] });
  });

  return router;
}