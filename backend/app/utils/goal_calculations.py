from sqlalchemy.orm import Session
from typing import List, Dict
from datetime import datetime

from app.models.goal import SavingsGoal

def calculate_goal_progress(
    db: Session,
    goal_id: int,
    user_id: int
) -> Dict[str, float]:
    """
    Calculate progress for a specific savings goal.
    """
    # Get the goal details
    goal = db.query(SavingsGoal).filter(
        SavingsGoal.id == goal_id,
        SavingsGoal.user_id == user_id
    ).first()
    
    if not goal:
        return {
            "goal_id": goal_id,
            "target_amount": 0.0,
            "current_amount": 0.0,
            "remaining": 0.0,
            "percentage_complete": 0.0,
            "is_complete": False
        }
    
    # Calculate remaining and percentage
    remaining = goal.target_amount - goal.current_amount
    percentage_complete = (goal.current_amount / goal.target_amount * 100) if goal.target_amount > 0 else 0.0
    is_complete = goal.current_amount >= goal.target_amount
    
    return {
        "goal_id": goal_id,
        "target_amount": goal.target_amount,
        "current_amount": goal.current_amount,
        "remaining": max(remaining, 0.0),  # Ensure remaining is not negative
        "percentage_complete": min(percentage_complete, 100.0),  # Cap at 100%
        "is_complete": is_complete
    }

def get_user_goals_progress(
    db: Session,
    user_id: int
) -> List[Dict]:
    """
    Get progress for all savings goals of a user.
    """
    goals = db.query(SavingsGoal).filter(SavingsGoal.user_id == user_id).all()
    
    goals_progress = []
    for goal in goals:
        progress = calculate_goal_progress(db, goal.id, user_id)
        goals_progress.append({
            "id": goal.id,
            "name": goal.name,
            "target_amount": goal.target_amount,
            "current_amount": goal.current_amount,
            "remaining": progress["remaining"],
            "target_date": goal.target_date,
            "description": goal.description,
            "percentage_complete": progress["percentage_complete"],
            "is_complete": progress["is_complete"]
        })
    
    return goals_progress