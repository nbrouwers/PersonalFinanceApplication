from pydantic import BaseModel, Field
from typing import Optional

class AccountBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    account_type: str = Field(..., pattern="^(checking|savings|credit|investment|loan|cash)$")

class AccountCreate(AccountBase):
    balance: Optional[float] = Field(default=0.0, ge=0)

class AccountUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    account_type: Optional[str] = Field(None, pattern="^(checking|savings|credit|investment|loan|cash)$")
    balance: Optional[float] = Field(None, ge=0)

class AccountInDBBase(AccountBase):
    id: int
    balance: float
    user_id: int
    
    class Config:
        from_attributes = True

class AccountInDB(AccountInDBBase):
    pass

class Account(AccountInDBBase):
    pass