from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from app.models.transaction import Transaction
from app.models.account import Account
from app.models.category import Category
from app.models.user import User
from app.schemas.transaction import TransactionCreate
from app.services.csv_import import parse_csv_file, validate_transactions, get_account_id_by_name, get_category_id_by_name
from app.utils.security import get_current_active_user
from app.db.session import get_db

router = APIRouter(
    prefix="/import",
    tags=["import"],
    responses={404: {"description": "Not found"}},
)

@router.post("/csv", status_code=status.HTTP_200_OK)
def import_csv_transactions(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check file type
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    # Read file content
    content = file.file.read()
    
    try:
        # Parse CSV file
        transactions_data = parse_csv_file(content)
        
        # Validate transactions and check for duplicates
        valid_transactions, duplicate_transactions = validate_transactions(
            transactions_data, db, current_user
        )
        
        # Process valid transactions
        created_transactions = []
        for tx_data in valid_transactions:
            # Get account ID if account name was provided
            account_id = tx_data.get('account_id')
            if 'account_name' in tx_data and tx_data['account_name']:
                account_id = get_account_id_by_name(db, current_user.id, tx_data['account_name'])
            elif not account_id:
                raise ValueError("Either account_id or account_name must be provided")
            
            # Get category ID if category name was provided
            category_id = tx_data.get('category_id')
            if 'category_name' in tx_data and tx_data['category_name']:
                category_id = get_category_id_by_name(db, current_user.id, tx_data['category_name'])
            elif not category_id:
                raise ValueError("Either category_id or category_name must be provided")
            
            # Create transaction object
            transaction = TransactionCreate(
                amount=tx_data['amount'],
                description=tx_data['description'],
                transaction_type=tx_data.get('transaction_type', 'expense'),  # Default to expense
                date=tx_data['date'],
                category_id=category_id,
                account_id=account_id
            )
            
            # Create transaction in database
            db_transaction = Transaction(**transaction.model_dump(), user_id=current_user.id)
            db.add(db_transaction)
            created_transactions.append(db_transaction)
        
        # Commit all transactions
        db.commit()
        
        # Refresh transactions to get IDs
        for tx in created_transactions:
            db.refresh(tx)
        
        return {
            "message": f"Successfully imported {len(created_transactions)} transactions",
            "imported_count": len(created_transactions),
            "duplicate_count": len(duplicate_transactions),
            "duplicates": [
                {
                    "date": tx['date'],
                    "description": tx['description'],
                    "amount": tx['amount']
                } for tx in duplicate_transactions[:5]  # Limit to first 5 duplicates
            ]
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")