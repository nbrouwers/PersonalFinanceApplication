from pydantic import BaseModel, Field
from typing import Optional

class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: str = Field(..., pattern="^(expense|income)$")
    parent_id: Optional[int] = None
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    type: Optional[str] = Field(None, pattern="^(expense|income)$")
    parent_id: Optional[int] = None
    description: Optional[str] = None

class CategoryInDBBase(CategoryBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class CategoryInDB(CategoryInDBBase):
    pass

class Category(CategoryInDBBase):
    pass