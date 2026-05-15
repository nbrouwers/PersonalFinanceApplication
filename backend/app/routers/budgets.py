from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.models.budget import Budget
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetInDB
from app.db.session import get_db

router = APIRouter(prefix="/budgets", tags=["budgets"], responses={404: {"description": "Not found"}})

@router.post("/", response_model=BudgetInDB, status_code=status.HTTP_201_CREATED)
def create_budget(budget: BudgetCreate, db: Session = Depends(get_db)):
    db_budget = Budget(**budget.model_dump(), user_id=1)
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget

@router.get("/", response_model=List[BudgetInDB])
def read_budgets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Budget).offset(skip).limit(limit).all()

@router.get("/{budget_id}", response_model=BudgetInDB)
def read_budget(budget_id: int, db: Session = Depends(get_db)):
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if budget is None:
        raise HTTPException(status_code=404, detail="Budget not found")
    return budget

@router.put("/{budget_id}", response_model=BudgetInDB)
def update_budget(budget_id: int, budget: BudgetUpdate, db: Session = Depends(get_db)):
    db_budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if db_budget is None:
        raise HTTPException(status_code=404, detail="Budget not found")
    update_data = budget.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_budget, key, value)
    db.commit()
    db.refresh(db_budget)
    return db_budget

@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(budget_id: int, db: Session = Depends(get_db)):
    db_budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if db_budget is None:
        raise HTTPException(status_code=404, detail="Budget not found")
    db.delete(db_budget)
    db.commit()
    return None