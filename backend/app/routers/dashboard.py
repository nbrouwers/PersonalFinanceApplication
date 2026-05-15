from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.account import Account
from app.models.budget import Budget
from app.models.goal import SavingsGoal
from app.models.transaction import Transaction
from app.db.session import get_db

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    accounts = db.query(Account).all()
    total_balance = sum(a.balance for a in accounts) if accounts else 0.0

    budgets = db.query(Budget).all()
    budget_list = []
    for b in budgets:
        spent = db.query(func.sum(Transaction.amount)).filter(
            Transaction.category_id == b.category_id,
            Transaction.date >= b.start_date,
            Transaction.date <= b.end_date
        ).scalar() or 0.0
        budget_list.append({
            "name": b.name, "amount": b.amount,
            "spent": round(float(spent), 2), "period": b.period,
        })

    goals = db.query(SavingsGoal).all()
    goal_list = [{
        "name": g.name, "target_amount": g.target_amount,
        "current_amount": g.current_amount,
        "target_date": str(g.target_date) if g.target_date else None,
        "progress_pct": round((g.current_amount / g.target_amount * 100), 1) if g.target_amount > 0 else 0,
    } for g in goals]

    return {
        "total_balance": total_balance,
        "accounts": [{"name": a.name, "type": a.account_type, "balance": a.balance} for a in accounts],
        "budgets": budget_list,
        "goals": goal_list,
    }