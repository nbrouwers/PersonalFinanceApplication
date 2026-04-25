import { query } from '../db';

export interface ExportOptions {
  userId: number;
  format: 'csv' | 'json';
  startDate?: string;
  endDate?: string;
  includeCategories?: boolean;
}

export async function exportTransactions(options: ExportOptions): Promise<string> {
  const { userId, format, startDate, endDate } = options;
  
  let sql = `
    SELECT t.date, t.description, t.amount, t.type, t.currency, c.name as category
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = $1 AND t.is_deleted = FALSE
  `;
  const params: any[] = [userId];
  let paramIdx = 2;
  
  if (startDate) {
    sql += ` AND t.date >= $${paramIdx++}`;
    params.push(startDate);
  }
  if (endDate) {
    sql += ` AND t.date <= $${paramIdx++}`;
    params.push(endDate);
  }
  
  sql += ' ORDER BY t.date DESC';
  
  const sqlResult = await query(sql, params);
  
  if (format === 'json') {
    return JSON.stringify(sqlResult.rows, null, 2);
  }
  
  const headers = ['Date', 'Description', 'Amount', 'Type', 'Currency', 'Category'];
  const rows = sqlResult.rows.map((row: any) => [
    row.date,
    escapeCSV(row.description),
    row.amount,
    row.type,
    row.currency,
    row.category || '',
  ]);
  
  return [headers.join(','), ...rows.map((r: any[]) => r.join(','))].join('\n');
}

function escapeCSV(value: string): string {
  if (!value) return '';
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function exportBudgets(userId: number, format: 'csv' | 'json'): Promise<string> {
  const sqlResult = await query(
    `SELECT b.category_id, c.name as category, b.limit_amount, b.period,
            COALESCE((SELECT SUM(t.amount) FROM transactions t WHERE t.category_id = b.category_id AND t.user_id = b.user_id AND t.type = 'expense'), 0) as spent
     FROM budgets b LEFT JOIN categories c ON b.category_id = c.id WHERE b.user_id = $1`,
    [userId]
  );
  
  if (format === 'json') {
    return JSON.stringify(sqlResult.rows, null, 2);
  }
  
  const headers = ['Category', 'Limit', 'Period', 'Spent', 'Remaining'];
  const rows = sqlResult.rows.map((row: any) => [
    row.category || 'Uncategorized',
    row.limit_amount,
    row.period,
    row.spent,
    row.limit_amount - row.spent,
  ]);
  
  return [headers.join(','), ...rows.map((r: any[]) => r.join(','))].join('\n');
}

export async function exportSummary(userId: number, startDate: string, endDate: string): Promise<string> {
  const incomeResult = await query(
    `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = 'income' AND is_deleted = FALSE AND date >= $2 AND date <= $3`,
    [userId, startDate, endDate]
  );
  
  const expenseResult = await query(
    `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = 'expense' AND is_deleted = FALSE AND date >= $2 AND date <= $3`,
    [userId, startDate, endDate]
  );
  
  const income = parseFloat(incomeResult.rows[0].total);
  const expense = parseFloat(expenseResult.rows[0].total);
  
  const data = {
    period: { start: startDate, end: endDate },
    income,
    expense,
    net: income - expense,
    savingsRate: income > 0 ? ((income - expense) / income) * 100 : 0,
  };
  
  return JSON.stringify(data, null, 2);
}