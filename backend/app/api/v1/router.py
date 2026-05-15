from fastapi import APIRouter
from app.routers import accounts, transactions, categories, budgets
from app.routers import import_ as import_router
from app.routers import goals

api_router = APIRouter()
api_router.include_router(accounts.router, prefix="/accounts", tags=["accounts"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(budgets.router, prefix="/budgets", tags=["budgets"])
api_router.include_router(import_router.router, prefix="/import", tags=["import"])
api_router.include_router(goals.router, prefix="/goals", tags=["goals"])

# TODO: Include reports router as it is implemented