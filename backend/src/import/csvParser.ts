import fs from 'fs';
import path from 'path';

export interface ParsedTransaction {
  date: Date;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  currency: string;
  account?: string;
}

export interface ImportResult {
  transactions: ParsedTransaction[];
  errors: { row: number; error: string }[];
  duplicateCount: number;
}

export interface BankFormat {
  name: string;
  dateColumn: number;
  amountColumn: number;
  descriptionColumn: number;
  debitColumn?: number;
  creditColumn?: number;
  currencyColumn?: number;
  dateFormat: string;
  accountColumn?: number;
}

export const BANK_FORMATS: Record<string, BankFormat> = {
  chase: {
    name: 'Chase',
    dateColumn: 0,
    amountColumn: 2,
    descriptionColumn: 1,
    dateFormat: 'MM/DD/YYYY',
  },
  bankOfAmerica: {
    name: 'Bank of America',
    dateColumn: 0,
    amountColumn: 2,
    descriptionColumn: 1,
    dateFormat: 'MM/DD/YYYY',
  },
  wellsFargo: {
    name: 'Wells Fargo',
    dateColumn: 0,
    amountColumn: 2,
    descriptionColumn: 1,
    dateFormat: 'MM/DD/YYYY',
  },
  generic: {
    name: 'Generic',
    dateColumn: 0,
    amountColumn: 1,
    descriptionColumn: 2,
    dateFormat: 'YYYY-MM-DD',
  },
};

export function detectBankFormat(headers: string[]): BankFormat | null {
  const headerStr = headers.join(',').toLowerCase();
  
  if (headerStr.includes('chase')) return BANK_FORMATS.chase;
  if (headerStr.includes('bank of america')) return BANK_FORMATS.bankOfAmerica;
  if (headerStr.includes('wells fargo')) return BANK_FORMATS.wellsFargo;
  
  return BANK_FORMATS.generic;
}

export function parseCSV(content: string): string[][] {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  return lines.map(line => parseCSVLine(line));
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

export function parseDate(dateStr: string, format: string): Date {
  const cleaned = dateStr.trim().replace(/["']/g, '');
  
  if (format === 'MM/DD/YYYY') {
    const match = cleaned.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (match) {
      return new Date(parseInt(match[3]), parseInt(match[1]) - 1, parseInt(match[2]));
    }
  }
  
  if (format === 'YYYY-MM-DD') {
    const match = cleaned.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
    }
  }
  
  const parsed = new Date(cleaned);
  if (!isNaN(parsed.getTime())) return parsed;
  
  throw new Error(`Invalid date format: ${dateStr}`);
}

export function parseAmount(amountStr: string): number {
  const cleaned = amountStr.trim()
    .replace(/["'$,]/g, '')
    .replace(/\(([^)]+)\)/g, '-$1');
  
  const amount = parseFloat(cleaned);
  if (isNaN(amount)) throw new Error(`Invalid amount: ${amountStr}`);
  
  return amount;
}

export function determineTransactionType(amount: number): 'income' | 'expense' {
  return amount >= 0 ? 'income' : 'expense';
}

export function parseTransactions(
  content: string,
  format?: BankFormat,
  hasHeader = true
): ImportResult {
  const lines = parseCSV(content);
  const startIdx = hasHeader ? 1 : 0;
  const transactions: ParsedTransaction[] = [];
  const errors: { row: number; error: string }[] = [];
  
  let detectedFormat = format;
  if (!detectedFormat && hasHeader && lines[0]) {
    detectedFormat = detectBankFormat(lines[0]) || BANK_FORMATS.generic;
  }
  
  detectedFormat = detectedFormat || BANK_FORMATS.generic;
  
  for (let i = startIdx; i < lines.length; i++) {
    const row = lines[i];
    if (!row.length || !row.join('').trim()) continue;
    
    try {
      const date = parseDate(row[detectedFormat.dateColumn], detectedFormat.dateFormat);
      const amount = parseDate(row[detectedFormat.amountColumn], detectedFormat.dateFormat); // wrong
      
      const rowAmountStr = row[detectedFormat.amountColumn];
      const amountVal = parseAmount(rowAmountStr);
      
      const description = row[detectedFormat.descriptionColumn] || '';
      const currency = detectedFormat.currencyColumn && row[detectedFormat.currencyColumn]
        ? row[detectedFormat.currencyColumn]
        : 'USD';
      
      transactions.push({
        date,
        amount: amountVal,
        description,
        type: determineTransactionType(amountVal),
        currency,
        account: detectedFormat.accountColumn ? row[detectedFormat.accountColumn] : undefined,
      });
    } catch (err) {
      errors.push({ row: i + 1, error: (err as Error).message });
    }
  }
  
  return {
    transactions,
    errors,
    duplicateCount: 0,
  };
}

export function readCSVFile(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content;
}