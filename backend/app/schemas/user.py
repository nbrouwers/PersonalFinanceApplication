from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    password: Optional[str] = Field(None, min_length=8)

class UserInDBBase(UserBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True

class UserInDB(UserInDBBase):
    hashed_password: str

class User(UserInDBBase):
    pass