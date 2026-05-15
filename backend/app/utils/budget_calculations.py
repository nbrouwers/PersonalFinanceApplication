from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict
from datetime import datetime

from app.models.budget import Budget
from app.models.transaction import Transaction
from app.models.category import Category

def calculate_budget_spent(
    db: Session,
    budget_id: int,
    user_id: int
) -> float:
    """
    Calculate the total amount spent for a specific budget.
    """
    # Get the budget details
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == user_id
    ).first()
    
    if not budget:
        return 0.0
    
    # Calculate total spent in the budget's category within the date range
    spent = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == user_id,
        Transaction.category_id == budget.category_id,
        Transaction.date >= budget.start_date,
        Transaction.date <= budget.end_date
    ).scalar() or 0.0
    
    return spent

def get_budget_status(
    db: Session,
    budget_id: int,
    user_id: int
) -> Dict[str, float]:
    """
    Get budget status including spent amount, remaining amount, and percentage used.
    """
    # Get the budget details
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == user_id
    ).first()
    
    if not budget:
        return {
            "budget_id": budget_id,
            "amount": 0.0,
            "spent": 0.0,
            "remaining": 0.0,
            "percentage_used": 0.0
        }
    
    # Calculate spent amount
    spent = calculate_budget_spent(db, budget_id, user_id)
    
    # Calculate remaining and percentage
    remaining = budget.amount - spent
    percentage_used = (spent / budget.amount * 100) if budget.amount > 0 else 0.0
    
    return {
        "budget_id": budget_id,
        "amount": budget.amount,
        "spent": spent,
        "remaining": remaining,
        "percentage_used": min(percentage_used, 100.0)  # Cap at 100%
    }

def get_user_budgets_status(
    db: Session,
    user_id: int
) -> List[Dict]:
    """
    Get status for all budgets of a user.
    """
    budgets = db.query(Budget).filter(Budget.user_id == user_id).all()
    
    budget_statuses = []
    for budget in budgets:
        status = get_budget_status(db, budget.id, user_id)
        budget_statuses.append({
            "id": budget.id,
            "name": budget.name,
            "amount": budget.amount,
            "period": budget.period,
            "start_date": budget.start_date,
            "end_date": budget.end_date,
            "category_id": budget.category_id,
            "spent": status["spent"],
            "remaining": status["remaining"],
            "percentage_used": status["percentage_used"]
        })
    
    return budget_statuses