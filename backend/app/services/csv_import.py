import csv
import io
from typing import List, Tuple
from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from app.models.account import Account
from app.models.category import Category
from app.models.user import User

def parse_csv_file(file_content: bytes) -> List[dict]:
    """
    Parse a CSV file and return a list of transaction dictionaries.
    Expected CSV format:
    date,description,amount,account_name (optional),category_name (optional)
    """
    # Decode the file content
    content = file_content.decode('utf-8')
    # Use io.StringIO to create a file-like object
    csv_file = io.StringIO(content)
    # Use csv.DictReader to read the CSV into a dictionary
    reader = csv.DictReader(csv_file)
    
    transactions = []
    for row in reader:
        # Extract and validate the data
        transaction_data = {}
        # Date
        date_str = row.get('date') or row.get('Date')
        if not date_str:
            raise ValueError("Missing date in CSV row")
        transaction_data['date'] = date_str
        
        # Description
        description = row.get('description') or row.get('Description') or row.get('memo') or row.get('Memo')
        if not description:
            raise ValueError("Missing description in CSV row")
        transaction_data['description'] = description.strip()
        
        # Amount
        amount_str = row.get('amount') or row.get('Amount') or row.get('value') or row.get('Value')
        if not amount_str:
            raise ValueError("Missing amount in CSV row")
        try:
            amount = float(amount_str)
        except ValueError:
            raise ValueError(f"Invalid amount format: {amount_str}")
        transaction_data['amount'] = amount
        
        # Optional: account name
        account_name = row.get('account') or row.get('Account') or row.get('account_name')
        transaction_data['account_name'] = account_name.strip() if account_name else None
        
        # Optional: category name
        category_name = row.get('category') or row.get('Category') or row.get('category_name')
        transaction_data['category_name'] = category_name.strip() if category_name else None
        
        transactions.append(transaction_data)
    
    return transactions

def validate_transactions(
    transactions: List[dict],
    db: Session,
    current_user: User
) -> Tuple[List[dict], List[dict]]:
    """
    Validate transactions and separate valid ones from duplicates.
    Returns a tuple (valid_transactions, duplicate_transactions)
    """
    valid_transactions = []
    duplicate_transactions = []
    
    for tx in transactions:
        # Check for duplicate: same user, same date, same description, same amount
        existing = db.query(Transaction).filter(
            Transaction.user_id == current_user.id,
            Transaction.date == tx['date'],
            Transaction.description == tx['description'],
            Transaction.amount == tx['amount']
        ).first()
        
        if existing:
            duplicate_transactions.append(tx)
        else:
            valid_transactions.append(tx)
    
    return valid_transactions, duplicate_transactions

def get_account_id_by_name(db: Session, user_id: int, account_name: str) -> int:
    """
    Get the account ID by name for a given user.
    Raises ValueError if account not found.
    """
    account = db.query(Account).filter(
        Account.user_id == user_id,
        Account.name == account_name
    ).first()
    if not account:
        raise ValueError(f"Account '{account_name}' not found for user")
    return account.id

def get_category_id_by_name(db: Session, user_id: int, category_name: str) -> int:
    """
    Get the category ID by name for a given user.
    Raises ValueError if category not found.
    """
    category = db.query(Category).filter(
        Category.user_id == user_id,
        Category.name == category_name
    ).first()
    if not category:
        raise ValueError(f"Category '{category_name}' not found for user")
    return category.id