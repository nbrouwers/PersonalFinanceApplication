from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class TransactionBase(BaseModel):
    amount: float = Field(..., gt=0)
    description: Optional[str] = None
    transaction_type: str = Field(..., pattern="^(expense|income)$")
    date: date
    category_id: int
    account_id: int

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
    transaction_type: Optional[str] = Field(None, pattern="^(expense|income)$")
    date: Optional[date] = None
    category_id: Optional[int] = None
    account_id: Optional[int] = None

class TransactionInDBBase(TransactionBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

class TransactionInDB(TransactionInDBBase):
    pass

class Transaction(TransactionInDBBase):
    pass