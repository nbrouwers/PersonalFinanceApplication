import Database from 'better-sqlite3';
import { Pool } from 'pg';

const dbPath = process.env.SQLITE_PATH || './personal-finance.db';

let sqliteDb: Database.Database | null = null;
let pgPool: Pool | null = null;

function isSQLite(): boolean {
  const dbUrl = process.env.DATABASE_URL || '';
  return !dbUrl.includes('postgresql') && !dbUrl.includes('localhost:5432');
}

export function initDatabase(): void {
  if (isSQLite()) {
    console.log('Using SQLite database:', dbPath);
    sqliteDb = new Database(dbPath);
    sqliteDb.pragma('journal_mode = WAL');
    initializeSQLiteSchema();
  } else {
    console.log('Using PostgreSQL database');
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
}

function initializeSQLiteSchema(): void {
  if (!sqliteDb) return;
  
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      currency TEXT DEFAULT 'USD',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      iban TEXT,
      type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'credit', 'cash')),
      balance REAL DEFAULT 0,
      currency TEXT DEFAULT 'USD',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
      is_default INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      account_id INTEGER NOT NULL,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
      description TEXT,
      date TEXT NOT NULL,
      currency TEXT DEFAULT 'USD',
      is_deleted INTEGER DEFAULT 0,
      import_batch_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      limit_amount REAL NOT NULL,
      period TEXT NOT NULL CHECK (period IN ('monthly', 'yearly')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS import_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      file_name TEXT,
      total_rows INTEGER DEFAULT 0,
      imported_rows INTEGER DEFAULT 0,
      duplicate_rows INTEGER DEFAULT 0,
      error_rows INTEGER DEFAULT 0,
      import_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Seed default categories
    INSERT OR IGNORE INTO categories (name, type, is_default) VALUES
      ('Salary', 'income', 1),
      ('Freelance', 'income', 1),
      ('Investment', 'income', 1),
      ('Other Income', 'income', 1),
      ('Groceries', 'expense', 1),
      ('Utilities', 'expense', 1),
      ('Dining', 'expense', 1),
      ('Entertainment', 'expense', 1),
      ('Transportation', 'expense', 1),
      ('Healthcare', 'expense', 1),
      ('Housing', 'expense', 1),
      ('Other', 'expense', 1);
  `);

  console.log('SQLite schema initialized');
}

export function getSQLite(): Database.Database | null {
  return sqliteDb;
}

export function getPgPool(): Pool | null {
  return pgPool;
}

export function closeDatabase(): void {
  if (sqliteDb) {
    sqliteDb.close();
    sqliteDb = null;
  }
  if (pgPool) {
    pgPool.end();
    pgPool = null;
  }
}

// For simplicity, use direct SQLite methods
export function sqliteQuery(sql: string, params: any[] = []): any {
  if (!sqliteDb) {
    throw new Error('Database not initialized');
  }
  const stmt = sqliteDb.prepare(sql);
  if (sql.trim().toUpperCase().startsWith('SELECT')) {
    return stmt.all(...params);
  }
  return stmt.run(...params);
}