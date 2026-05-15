from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.account import Account
from app.models.budget import Budget
from app.models.goal import SavingsGoal
from app.utils.security import get_current_active_user
from app.db.session import get_db
from app.utils.budget_calculations import calculate_budget_spent

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/summary")
def get_dashboard_summary(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    accounts = db.query(Account).filter(Account.user_id == current_user.id).all()
    total_balance = sum(a.balance for a in accounts) if accounts else 0.0

    budgets = db.query(Budget).filter(Budget.user_id == current_user.id).all()
    budget_list = []
    for b in budgets:
        spent = calculate_budget_spent(db, b.id, current_user.id)
        budget_list.append({
            "name": b.name,
            "amount": b.amount,
            "spent": round(spent, 2),
            "period": b.period,
        })

    goals = db.query(SavingsGoal).filter(SavingsGoal.user_id == current_user.id).all()
    goal_list = [{
        "name": g.name,
        "target_amount": g.target_amount,
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