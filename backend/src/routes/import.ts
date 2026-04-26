import express, { Request, Response } from 'express';

const TRIODOS_HEADERS = ['Datum', 'IBAN', 'Bedrag', 'CreditDebit', 'Naam', 'Rekening', 'Soort', 'Omschrijving', 'Saldo'];

const parseDutchNumber = (value: string): number => {
  if (!value) return 0;
  const cleaned = value.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

const parseEuropeanDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateStr;
};

const detectFormat = (firstLine: string): 'triodos' | 'generic' => {
  const lower = firstLine.toLowerCase();
  if (lower.includes('datum') || lower.includes('iban') || lower.includes('bedrag')) {
    return 'triodos';
  }
  return 'generic';
};

const parseTriodosLine = (line: string): any => {
  const cols = line.split('","').map(s => s.replace(/"/g, ''));
  if (cols.length < 8) return null;
  
  const date = parseEuropeanDate(cols[0]);
  const iban = cols[1];
  const amount = parseDutchNumber(cols[2]);
  const creditDebit = cols[3];
  const name = cols[4];
  const description = cols[7];
  const type = creditDebit === 'Credit' ? 'income' : 'expense';
  
  return {
    date,
    iban,
    amount: Math.abs(amount),
    type,
    creditDebit,
    name,
    description,
    currency: 'EUR',
  };
};

const parseGenericLine = (line: string): any => {
  const cols = line.split(',');
  if (cols.length < 4) return null;
  
  return {
    date: cols[0],
    iban: null,
    amount: parseFloat(cols[2]) || 0,
    type: parseFloat(cols[2]) >= 0 ? 'income' : 'expense',
    description: cols[1] || '',
    currency: 'USD',
  };
};

const categorizeTransaction = (description: string): number | null => {
  const desc = description.toLowerCase();
  
  if (desc.includes('ah ') || desc.includes('albert heijn') || desc.includes('jumbo')) return 5;
  if (desc.includes('shell') || desc.includes('bp ') || desc.includes('total')) return 2;
  if (desc.includes('kosten') && desc.includes('triodos')) return 11;
  if (desc.includes('rente')) return 11;
  if (desc.includes('amazon')) return 8;
  
  return null;
};

export function createImportRouter(db: { query: (sql: string, params?: any[]) => any }): express.Router {
  const router = express.Router();

  router.post('/preview', async (req: Request, res: Response) => {
    try {
      const { csvContent, accountId } = req.body;
      if (!csvContent) return res.status(400).json({ error: 'CSV content is required' });
      
      const lines = csvContent.split('\n').filter((l: string) => l.trim());
      const firstLine = lines[0];
      const format = detectFormat(firstLine);
      
      let transactions = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        let tx;
        if (format === 'triodos') {
          tx = parseTriodosLine(lines[i]);
        } else {
          tx = parseGenericLine(lines[i]);
        }
        if (tx && tx.date) {
          tx.categoryId = categorizeTransaction(tx.description);
          transactions.push(tx);
        }
      }
      
      res.json({ 
        preview: transactions, 
        totalRows: lines.length - 1, 
        errorCount: 0, 
        detectedFormat: format 
      });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.post('/confirm', async (req: Request, res: Response) => {
    try {
      const { transactions, accountId, format } = req.body;
      if (!transactions?.length) return res.status(400).json({ error: 'Transactions array is required' });
      
      const userId = 1;
      
      const importResult = await db.query(
        `INSERT INTO import_history (user_id, file_name, total_rows, imported_rows) VALUES (?, ?, ?, ?) RETURNING id`,
        [userId, 'import.csv', transactions.length, transactions.length]
      );
      
      const importBatchId = importResult.rows?.[0]?.id;
      let importedCount = 0;
      
      for (const t of transactions) {
        let targetAccountId = accountId || 1;
        
        if (t.iban) {
          const existingAccount = await db.query(
            'SELECT id FROM accounts WHERE iban = ? AND user_id = ?',
            [t.iban, userId]
          );
          if (existingAccount.rows?.length) {
            targetAccountId = existingAccount.rows[0].id;
          }
        }
        
        await db.query(
          `INSERT INTO transactions (user_id, account_id, category_id, amount, type, description, date, currency, import_batch_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [userId, targetAccountId, t.categoryId || null, t.amount || 0, t.type || 'expense', t.description, t.date, t.currency || 'EUR', importBatchId]
        );
        importedCount++;
      }
      
      res.json({ success: true, importedCount, importBatchId });
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