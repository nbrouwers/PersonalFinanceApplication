import express, { Request, Response } from 'express';
import { exportTransactions, exportBudgets, exportSummary } from '../export/exporter';

const router = express.Router();

router.get('/transactions', async (req: Request, res: Response) => {
  try {
    const userId = 1;
    const { format = 'csv', startDate, endDate } = req.query;
    
    const content = await exportTransactions({
      userId,
      format: format as 'csv' | 'json',
      startDate: startDate as string,
      endDate: endDate as string,
    });
    
    const mimeType = format === 'json' ? 'application/json' : 'text/csv';
    const ext = format === 'json' ? 'json' : 'csv';
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename=transactions.${ext}`);
    res.send(content);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/budgets', async (req: Request, res: Response) => {
  try {
    const userId = 1;
    const { format = 'csv' } = req.query;
    
    const content = await exportBudgets(userId, format as 'csv' | 'json');
    
    const mimeType = format === 'json' ? 'application/json' : 'text/csv';
    const ext = format === 'json' ? 'json' : 'csv';
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename=budgets.${ext}`);
    res.send(content);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/summary', async (req: Request, res: Response) => {
  try {
    const userId = 1;
    const { startDate = '2026-01-01', endDate = '2026-12-31' } = req.query;
    
    const content = await exportSummary(userId, startDate as string, endDate as string);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=summary.json');
    res.send(content);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;