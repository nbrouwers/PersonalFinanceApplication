import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/personal_finance',
});

export interface CategoryRule {
  id: number;
  userId: number;
  keyword: string;
  categoryId: number;
  type: 'keyword' | 'merchant';
}

export async function findMatchingRule(description: string, userId: number): Promise<number | null> {
  const lowerDesc = description.toLowerCase();
  
  const result = await pool.query(
    `SELECT category_id, keyword, type FROM category_rules 
     WHERE user_id = $1 OR user_id IS NULL
     ORDER BY user_id DESC`,
    [userId]
  );
  
  for (const row of result.rows) {
    if (row.type === 'keyword' && lowerDesc.includes(row.keyword.toLowerCase())) {
      return row.category_id;
    }
    if (row.type === 'merchant' && lowerDesc.includes(row.merchant?.toLowerCase())) {
      return row.category_id;
    }
  }
  
  return null;
}

export async function createRule(userId: number, keyword: string, categoryId: number, type: 'keyword' | 'merchant'): Promise<void> {
  await pool.query(
    `INSERT INTO category_rules (user_id, keyword, category_id, type) VALUES ($1, $2, $3, $4)`,
    [userId, keyword, categoryId, type]
  );
}

export async function suggestCategory(description: string, userId: number): Promise<{ categoryId: number; confidence: number } | null> {
  const rulesMatch = await findMatchingRule(description, userId);
  if (rulesMatch) {
    return { categoryId: rulesMatch, confidence: 0.9 };
  }
  
  const keywords = {
    grocery: 1, groceries: 1, "whole foods": 1, "trader joe": 1, safeway: 1,
    restaurant: 2, cafe: 2, coffee: 2, starbucks: 2, mcdonald: 2,
    gas: 3, fuel: 3, shell: 3, chevron: 3,
    uber: 4, lyft: 4, taxi: 4,
    netflix: 5, spotify: 5, hulu: 5, "amazon prime": 5,
    electric: 6, utility: 6, water: 6,
    doctor: 7, pharmacy: 7, cvs: 7, walgreens: 7,
    amazon: 8, target: 8, walmart: 8,
    salary: 9, paycheck: 9,
  } as Record<string, number>;
  
  const lowerDesc = description.toLowerCase();
  for (const [keyword, categoryId] of Object.entries(keywords)) {
    if (lowerDesc.includes(keyword)) {
      return { categoryId, confidence: 0.6 };
    }
  }
  
  return null;
}