-- Create database
CREATE DATABASE personalfinance;

-- Connect to the database
\c personalfinance;

-- Create tables for accounts, transactions, categories, budgets, savings goals
-- We'll create them in the application via migrations, but we can also create them here for simplicity.
-- However, note that we are going to use SQLAlchemy, so we might prefer to let Alembic handle migrations.
-- For now, we'll leave the table creation to the application and just set up the database and user.

-- Create a user for the application (optional, for now we can use postgres user)
-- CREATE USER financeuser WITH PASSWORD 'financepass';
-- GRANT ALL PRIVILEGES ON DATABASE personalfinance TO financeuser;