from fastapi import APIRouter
from app.routers import accounts, transactions, categories, budgets, goals, dashboard
from app.routers import import_ as import_router

api_router = APIRouter()
api_router.include_router(accounts.router)
api_router.include_router(transactions.router)
api_router.include_router(categories.router)
api_router.include_router(budgets.router)
api_router.include_router(goals.router)
api_router.include_router(import_router.router)
api_router.include_router(dashboard.router)