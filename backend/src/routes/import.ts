import express, { Request, Response } from 'express';

export function createImportRouter(db: { query: (sql: string, params?: any[]) => any }): express.Router {
  const router = express.Router();

  router.post('/preview', async (req: Request, res: Response) => {
    try {
      const { csvContent, accountId, userId } = req.body;
      if (!csvContent) return res.status(400).json({ error: 'CSV content is required' });
      
      const lines = csvContent.split('\n').filter(l => l.trim());
      const transactions = lines.slice(1, 11).map((line: string) => {
        const cols = line.split(',');
        return { date: cols[0], amount: parseFloat(cols[2]) || 0, description: cols[1], type: (parseFloat(cols[2]) || 0) >= 0 ? 'income' : 'expense' };
      });
      
      res.json({ preview: transactions, totalRows: lines.length - 1, errorCount: 0, detectedFormat: 'generic' });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.post('/confirm', async (req: Request, res: Response) => {
    try {
      const { transactions, accountId, userId } = req.body;
      if (!transactions?.length) return res.status(400).json({ error: 'Transactions array is required' });
      
      const importResult = await db.query(
        `INSERT INTO import_history (user_id, file_name, total_rows, imported_rows) VALUES (?, ?, ?, ?) RETURNING id`,
        [userId || 1, 'import.csv', transactions.length, transactions.length]
      );
      
      const importBatchId = importResult.rows?.[0]?.id;
      
      for (const t of transactions) {
        await db.query(
          `INSERT INTO transactions (user_id, account_id, amount, type, description, date, currency, import_batch_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [userId || 1, accountId || 1, t.amount || 0, t.type || 'expense', t.description, t.date, t.currency || 'USD', importBatchId]
        );
      }
      
      res.json({ success: true, importedCount: transactions.length, importBatchId });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.get('/history', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const result = await db.query(
        `SELECT id, file_name, total_rows, imported_rows, duplicate_rows, error_rows, import_date FROM import_history WHERE user_id = ? ORDER BY import_date DESC LIMIT 20`,
        [userId]
      );
      res.json(result.rows || []);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.delete('/:importId', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const { importId } = req.params;
      
      await db.query(`DELETE FROM transactions WHERE import_batch_id = ? AND user_id = ?`, [importId, userId]);
      await db.query(`DELETE FROM import_history WHERE id = ? AND user_id = ?`, [importId, userId]);
      
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}