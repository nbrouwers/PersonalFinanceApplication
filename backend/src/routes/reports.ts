import express, { Request, Response } from 'express';

export function createReportsRouter(_db: { query: (sql: string, params?: any[]) => any }): express.Router {
  const router = express.Router();

  router.get('/', async (_req: Request, res: Response) => {
    res.json({ reports: [] });
  });

  return router;
}