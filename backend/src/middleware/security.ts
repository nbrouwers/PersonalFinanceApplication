import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const importLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many import requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 10000);
}

export function validateTransactionInput(data: any): { valid: boolean; error?: string } {
  if (!data.accountId || typeof data.accountId !== 'number') {
    return { valid: false, error: 'accountId is required' };
  }
  
  if (!data.amount || typeof data.amount !== 'number') {
    return { valid: false, error: 'amount is required' };
  }
  
  if (data.amount > 1000000 || data.amount < -1000000) {
    return { valid: false, error: 'amount exceeds limit' };
  }
  
  if (!data.type || !['income', 'expense'].includes(data.type)) {
    return { valid: false, error: 'type must be income or expense' };
  }
  
  if (!data.date) {
    return { valid: false, error: 'date is required' };
  }
  
  return { valid: true };
}

export function validateBudgetInput(data: any): { valid: boolean; error?: string } {
  if (!data.limitAmount || typeof data.limitAmount !== 'number') {
    return { valid: false, error: 'limitAmount is required' };
  }
  
  if (data.limitAmount < 0 || data.limitAmount > 1000000) {
    return { valid: false, error: 'limitAmount is invalid' };
  }
  
  if (!data.period || !['monthly', 'yearly'].includes(data.period)) {
    return { valid: false, error: 'period must be monthly or yearly' };
  }
  
  return { valid: true };
}