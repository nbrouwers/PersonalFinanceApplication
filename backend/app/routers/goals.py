from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.models.goal import SavingsGoal
from app.schemas.goal import SavingsGoalCreate, SavingsGoalUpdate, SavingsGoalInDB
from app.db.session import get_db

router = APIRouter(prefix="/goals", tags=["goals"], responses={404: {"description": "Not found"}})

@router.post("/", response_model=SavingsGoalInDB, status_code=status.HTTP_201_CREATED)
def create_goal(goal: SavingsGoalCreate, db: Session = Depends(get_db)):
    db_goal = SavingsGoal(**goal.model_dump(), user_id=1)
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.get("/", response_model=List[SavingsGoalInDB])
def read_goals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(SavingsGoal).offset(skip).limit(limit).all()

@router.get("/{goal_id}", response_model=SavingsGoalInDB)
def read_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id).first()
    if goal is None:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal

@router.put("/{goal_id}", response_model=SavingsGoalInDB)
def update_goal(goal_id: int, goal: SavingsGoalUpdate, db: Session = Depends(get_db)):
    db_goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id).first()
    if db_goal is None:
        raise HTTPException(status_code=404, detail="Goal not found")
    update_data = goal.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_goal, key, value)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    db_goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id).first()
    if db_goal is None:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(db_goal)
    db.commit()
    return None

@router.patch("/{goal_id}/contribute", response_model=SavingsGoalInDB)
def contribute_to_goal(goal_id: int, amount: float, db: Session = Depends(get_db)):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Contribution amount must be positive")
    db_goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id).first()
    if db_goal is None:
        raise HTTPException(status_code=404, detail="Goal not found")
    db_goal.current_amount += amount
    db.commit()
    db.refresh(db_goal)
    return db_goal