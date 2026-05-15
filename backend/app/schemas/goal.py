from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SavingsGoalBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    target_amount: float = Field(..., gt=0)
    current_amount: float = Field(default=0.0, ge=0)
    target_date: Optional[datetime] = None
    description: Optional[str] = None

class SavingsGoalCreate(SavingsGoalBase):
    pass

class SavingsGoalUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    target_amount: Optional[float] = Field(None, gt=0)
    current_amount: Optional[float] = Field(None, ge=0)
    target_date: Optional[datetime] = None
    description: Optional[str] = None

class SavingsGoalInDBBase(SavingsGoalBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

class SavingsGoalInDB(SavingsGoalInDBBase):
    pass

class SavingsGoal(SavingsGoalInDBBase):
    pass