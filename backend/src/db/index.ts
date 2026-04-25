import Database from 'better-sqlite3';
import { Pool, PoolConfig } from 'pg';

let db: Database.Database | null = null;
let pool: Pool | null = null;

const isSQLite = (): boolean => {
  const dbUrl = process.env.DATABASE_URL || '';
  return dbUrl === '' || (!dbUrl.includes('postgresql') && !dbUrl.includes('localhost'));
};

export const initDatabase = (): void => {
  if (isSQLite()) {
    const dbPath = process.env.SQLITE_PATH || './data/personal-finance.db';
    console.log('[DB] Using SQLite at:', dbPath);
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    createSQLiteSchema();
    console.log('[DB] SQLite schema ready');
  } else {
    const config: PoolConfig = { connectionString: process.env.DATABASE_URL };
    pool = new Pool(config);
    console.log('[DB] Using PostgreSQL');
  }
};

const createSQLiteSchema = (): void => {
  if (!db) return;
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, currency TEXT DEFAULT 'USD', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, name TEXT NOT NULL, type TEXT NOT NULL, balance REAL DEFAULT 0, currency TEXT DEFAULT 'USD', is_active INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, user_id INTEGER, name TEXT NOT NULL, type TEXT NOT NULL, is_default INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, account_id INTEGER NOT NULL, category_id INTEGER, amount REAL NOT NULL, type TEXT NOT NULL, description TEXT, date TEXT NOT NULL, currency TEXT DEFAULT 'USD', is_deleted INTEGER DEFAULT 0, import_batch_id INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS budgets (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, category_id INTEGER, limit_amount REAL NOT NULL, period TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS import_history (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, file_name TEXT, total_rows INTEGER DEFAULT 0, imported_rows INTEGER DEFAULT 0, duplicate_rows INTEGER DEFAULT 0, error_rows INTEGER DEFAULT 0, import_date DATETIME DEFAULT CURRENT_TIMESTAMP);
    INSERT OR IGNORE INTO categories (name, type, is_default) VALUES ('Salary', 'income', 1), ('Freelance', 'income', 1), ('Investment', 'income', 1), ('Other Income', 'income', 1), ('Groceries', 'expense', 1), ('Utilities', 'expense', 1), ('Dining', 'expense', 1), ('Entertainment', 'expense', 1), ('Transportation', 'expense', 1), ('Healthcare', 'expense', 1), ('Housing', 'expense', 1), ('Other', 'expense', 1);
  `);
};

export const query = (text: string, params: any[] = []): any => {
  if (isSQLite()) {
    if (!db) throw new Error('SQLite not initialized');
    const stmt = db.prepare(text);
    if (text.trim().toUpperCase().startsWith('SELECT')) {
      return { rows: stmt.all(...params) };
    }
    const result = stmt.run(...params);
    return { rows: [result], rowCount: result.changes };
  }
  if (!pool) throw new Error('PostgreSQL pool not initialized');
  return pool.query(text, params);
};

export const close = (): void => {
  if (db) {
    db.close();
    db = null;
  }
  if (pool) {
    pool.end();
    pool = null;
  }
};