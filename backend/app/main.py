from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router

app = FastAPI(
    title="Personal Finance API",
    description="API for personal finance management application. Provides endpoints for managing accounts, transactions, categories, budgets, savings goals, and more.",
    version="0.1.0",
    swagger_ui_parameters={"syntaxHighlight.theme": "obsidian"},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to the Personal Finance API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}