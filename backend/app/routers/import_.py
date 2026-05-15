from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.models.account import Account
from app.models.category import Category
from app.schemas.transaction import TransactionCreate
from app.services.csv_import import parse_csv_file
from app.db.session import get_db

router = APIRouter(prefix="/import", tags=["import"], responses={404: {"description": "Not found"}})

def get_account_id_by_name(db: Session, name: str) -> int:
    account = db.query(Account).filter(Account.name == name).first()
    if not account:
        raise HTTPException(status_code=400, detail=f"Account '{name}' not found")
    return account.id

def get_category_id_by_name(db: Session, name: str) -> int:
    category = db.query(Category).filter(Category.name == name).first()
    if not category:
        raise HTTPException(status_code=400, detail=f"Category '{name}' not found")
    return category.id

@router.post("/csv", status_code=status.HTTP_200_OK)
def import_csv_transactions(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    content = file.file.read()
    try:
        transactions_data = parse_csv_file(content)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    created = []
    duplicates = []
    for tx_data in transactions_data:
        existing = db.query(Transaction).filter(
            Transaction.date == tx_data['date'],
            Transaction.description == tx_data['description'],
            Transaction.amount == tx_data['amount']
        ).first()
        if existing:
            duplicates.append(tx_data)
            continue

        account_id = tx_data.get('account_id')
        if 'account_name' in tx_data and tx_data['account_name']:
            account_id = get_account_id_by_name(db, tx_data['account_name'])
        elif not account_id:
            raise HTTPException(status_code=400, detail="Either account_id or account_name must be provided")

        category_id = tx_data.get('category_id')
        if 'category_name' in tx_data and tx_data['category_name']:
            category_id = get_category_id_by_name(db, tx_data['category_name'])
        elif not category_id:
            raise HTTPException(status_code=400, detail="Either category_id or category_name must be provided")

        transaction = TransactionCreate(
            amount=tx_data['amount'], description=tx_data['description'],
            transaction_type=tx_data.get('transaction_type', 'expense'),
            date=tx_data['date'], category_id=category_id, account_id=account_id
        )
        db_transaction = Transaction(**transaction.model_dump(), user_id=1)
        db.add(db_transaction)
        created.append(db_transaction)

    db.commit()
    for tx in created:
        db.refresh(tx)

    return {
        "message": f"Successfully imported {len(created)} transactions",
        "imported_count": len(created),
        "duplicate_count": len(duplicates),
        "duplicates": [{"date": tx['date'], "description": tx['description'], "amount": tx['amount']} for tx in duplicates[:5]]
    }