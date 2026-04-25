import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import { parseTransactions, detectBankFormat } from '../../import/csvParser';

const router = express.Router();

export function createImportRouter(pool: Pool): express.Router {
  router.post('/preview', async (req: Request, res: Response) => {
    try {
      const { csvContent, accountId, userId } = req.body;
      
      if (!csvContent) {
        return res.status(400).json({ error: 'CSV content is required' });
      }
      
      const result = parseTransactions(csvContent);
      
      res.json({
        preview: result.transactions.slice(0, 10),
        totalRows: result.transactions.length,
        errorCount: result.errors.length,
        detectedFormat: detectBankFormat(csvContent.split('\n')[0].split(',')),
      });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.post('/confirm', async (req: Request, res: Response) => {
    try {
      const { transactions, accountId, userId } = req.body;
      
      if (!transactions || !Array.isArray(transactions)) {
        return res.status(400).json({ error: 'Transactions array is required' });
      }
      
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        const importResult = await client.query(
          `INSERT INTO import_history (user_id, file_name, total_rows, imported_rows)
           VALUES ($1, $2, $3, $4) RETURNING id`,
          [userId, 'import.csv', transactions.length, transactions.length]
        );
        
        const importBatchId = importResult.rows[0].id;
        
        for (const t of transactions) {
          await client.query(
            `INSERT INTO transactions (user_id, account_id, amount, type, description, date, currency, import_batch_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [userId, accountId, t.amount, t.type, t.description, t.date, t.currency || 'USD', importBatchId]
          );
        }
        
        await client.query('COMMIT');
        
        res.json({
          success: true,
          importedCount: transactions.length,
          importBatchId,
        });
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.get('/history', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      
      const result = await pool.query(
        `SELECT id, file_name, total_rows, imported_rows, duplicate_rows, error_rows, import_date
         FROM import_history WHERE user_id = $1 ORDER BY import_date DESC LIMIT 20`,
        [userId]
      );
      
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.delete('/:importId', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { importId } = req.params;
      
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        const txResult = await client.query(
          `SELECT import_date FROM import_history WHERE id = $1 AND user_id = $2`,
          [importId, userId]
        );
        
        if (txResult.rows.length === 0) {
          return res.status(404).json({ error: 'Import not found' });
        }
        
        const importDate = txResult.rows[0].import_date;
        const hoursSinceImport = (Date.now() - new Date(importDate).getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceImport > 24) {
          return res.status(400).json({ error: 'Undo window has expired (24 hours)' });
        }
        
        await client.query(
          `DELETE FROM transactions WHERE import_batch_id = $1 AND user_id = $2`,
          [importId, userId]
        );
        
        await client.query(
          `DELETE FROM import_history WHERE id = $1 AND user_id = $2`,
          [importId, userId]
        );
        
        await client.query('COMMIT');
        
        res.json({ success: true });
      } finally {
        client.release();
      }
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}