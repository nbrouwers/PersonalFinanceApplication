from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class BudgetBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    amount: float = Field(..., gt=0)
    period: str = Field(..., pattern="^(monthly|yearly)$")
    start_date: datetime
    end_date: datetime
    category_id: int

class BudgetCreate(BudgetBase):
    pass

class BudgetUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    amount: Optional[float] = Field(None, gt=0)
    period: Optional[str] = Field(None, pattern="^(monthly|yearly)$")
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    category_id: Optional[int] = None

class BudgetInDBBase(BudgetBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

class BudgetInDB(BudgetInDBBase):
    pass

class Budget(BudgetInDBBase):
    pass