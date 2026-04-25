import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const router = express.Router();

export function createReportsRouter(pool: Pool): express.Router {
  router.get('/summary', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const { startDate, endDate } = req.query;
      
      const incomeResult = await pool.query(
        `SELECT COALESCE(SUM(amount), 0) as total FROM transactions
         WHERE user_id = $1 AND type = 'income' AND is_deleted = FALSE
         AND date >= $2 AND date <= $3`,
        [userId, startDate || '2026-01-01', endDate || '2026-12-31']
      );
      
      const expenseResult = await pool.query(
        `SELECT COALESCE(SUM(amount), 0) as total FROM transactions
         WHERE user_id = $1 AND type = 'expense' AND is_deleted = FALSE
         AND date >= $2 AND date <= $3`,
        [userId, startDate || '2026-01-01', endDate || '2026-12-31']
      );
      
      const income = parseFloat(incomeResult.rows[0].total);
      const expense = parseFloat(expenseResult.rows[0].total);
      
      res.json({
        income,
        expense,
        net: income - expense,
        savingsRate: income > 0 ? ((income - expense) / income) * 100 : 0,
      });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.get('/by-category', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const { type = 'expense', startDate, endDate } = req.query;
      
      const result = await pool.query(
        `SELECT c.name, SUM(t.amount) as total
         FROM transactions t
         JOIN categories c ON t.category_id = c.id
         WHERE t.user_id = $1 AND t.type = $2 AND t.is_deleted = FALSE
         AND t.date >= $3 AND t.date <= $4
         GROUP BY c.id, c.name
         ORDER BY total DESC`,
        [userId, type, startDate || '2026-01-01', endDate || '2026-12-31']
      );
      
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.get('/ytd', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const year = new Date().getFullYear();
      
      const monthlyResult = await pool.query(
        `SELECT EXTRACT(MONTH FROM date) as month, type, SUM(amount) as total
         FROM transactions
         WHERE user_id = $1 AND EXTRACT(YEAR FROM date) = $2 AND is_deleted = FALSE
         GROUP BY EXTRACT(MONTH FROM date), type
         ORDER BY month, type`,
        [userId, year]
      );
      
      const monthly: Record<string, { income: number; expense: number }> = {};
      for (const row of monthlyResult.rows) {
        const m = String(row.month).padStart(2, '0');
        if (!monthly[m]) monthly[m] = { income: 0, expense: 0 };
        if (row.type === 'income') monthly[m].income = parseFloat(row.total);
        else monthly[m].expense = parseFloat(row.total);
      }
      
      const totalIncome = monthlyResult.rows.filter((r: any) => r.type === 'income').reduce((s: number, r: any) => s + parseFloat(r.total), 0);
      const totalExpense = monthlyResult.rows.filter((r: any) => r.type === 'expense').reduce((s: number, r: any) => s + parseFloat(r.total), 0);
      const projected = totalIncome > 0 ? (totalIncome / new Date().getMonth()) * 12 : 0;
      
      res.json({
        monthly,
        yearToDate: { income: totalIncome, expense: totalExpense },
        projected,
      });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.get('/tax', async (req: Request, res: Response) => {
    try {
      const userId = 1;
      const { year = new Date().getFullYear() - 1 } = req.query;
      
      const incomeResult = await pool.query(
        `SELECT c.name, SUM(t.amount) as total
         FROM transactions t
         JOIN categories c ON t.category_id = c.id
         WHERE t.user_id = $1 AND t.type = 'income' AND t.is_deleted = FALSE
         AND EXTRACT(YEAR FROM date) = $2
         GROUP BY c.id, c.name
         ORDER BY total DESC`,
        [userId, year]
      );
      
      const expenseResult = await pool.query(
        `SELECT c.name, SUM(t.amount) as total
         FROM transactions t
         JOIN categories c ON t.category_id = c.id
         WHERE t.user_id = $1 AND t.type = 'expense' AND t.is_deleted = FALSE
         AND EXTRACT(YEAR FROM date) = $2
         AND c.name IN ('Healthcare', 'Charity')
         GROUP BY c.id, c.name
         ORDER BY total DESC`,
        [userId, year]
      );
      
      const income = parseFloat(incomeResult.rows.reduce((s: number, r: any) => s + parseFloat(r.total), 0));
      const deductions = parseFloat(expenseResult.rows.reduce((s: number, r: any) => s + parseFloat(r.total), 0));
      const estimatedTax = Math.max(0, (income - deductions) * 0.22);
      
      res.json({
        year,
        income,
        deductions,
        estimatedTax,
        incomeBySource: incomeResult.rows,
        deductibleExpenses: expenseResult.rows,
      });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}