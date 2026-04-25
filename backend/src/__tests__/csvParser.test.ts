import { describe, it, expect } from '@jest/globals';
import { parseCSV, parseTransactions, detectBankFormat, parseAmount, parseDate } from '../import/csvParser';

describe('CSV Parser', () => {
  describe('parseCSV', () => {
    it('parses basic CSV', () => {
      const result = parseCSV('Date,Description,Amount\n2026-01-15,Grocery,50.00');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(['Date', 'Description', 'Amount']);
      expect(result[1]).toEqual(['2026-01-15', 'Grocery', '50.00']);
    });

    it('handles quoted fields', () => {
      const result = parseCSV('Date,Description\n2026-01-15,"Whole Foods Market"');
      expect(result[1][1]).toBe('Whole Foods Market');
    });
  });

  describe('parseAmount', () => {
    it('parses positive amount', () => {
      expect(parseAmount('50.00')).toBe(50);
    });

    it('parses negative amount', () => {
      expect(parseAmount('-50.00')).toBe(-50);
    });

    it('handles currency symbols', () => {
      expect(parseAmount('$50.00')).toBe(50);
      expect(parseAmount('$1,234.56')).toBe(1234.56);
    });
  });

  describe('parseDate', () => {
    it('parses MM/DD/YYYY format', () => {
      const date = parseDate('01/15/2026', 'MM/DD/YYYY');
      expect(date.getFullYear()).toBe(2026);
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBe(15);
    });

    it('parses YYYY-MM-DD format', () => {
      const date = parseDate('2026-01-15', 'YYYY-MM-DD');
      expect(date.getFullYear()).toBe(2026);
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBe(15);
    });
  });

  describe('detectBankFormat', () => {
    it('detects Chase format', () => {
      const format = detectBankFormat(['Date', 'Description', 'Amount', 'Balance']);
      expect(format?.name).toBe('Chase');
    });

    it('defaults to generic', () => {
      const format = detectBankFormat(['transaction_date', 'memo', 'value']);
      expect(format?.name).toBe('Generic');
    });
  });

  describe('parseTransactions', () => {
    it('parses valid CSV', () => {
      const csv = `Date,Description,Amount
01/15/2026,Grocery Store,50.00
01/16/2026,Gas Station,-45.00`;
      
      const result = parseTransactions(csv);
      
      expect(result.transactions).toHaveLength(2);
      expect(result.transactions[0].description).toBe('Grocery Store');
      expect(result.transactions[0].amount).toBe(50);
      expect(result.transactions[0].type).toBe('income');
      expect(result.transactions[1].type).toBe('expense');
    });

    it('collects parsing errors', () => {
      const csv = `Date,Description,Amount
invalid date,Grocery,50.00`;
      
      const result = parseTransactions(csv);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});