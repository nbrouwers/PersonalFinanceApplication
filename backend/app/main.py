from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.utils.rate_limiting import limiter, custom_rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

app = FastAPI(
    title="Personal Finance API",
    description="""API for personal finance management application. 
    Provides endpoints for managing accounts, transactions, categories, budgets, savings goals, and more.
    Features include CSV import, budget tracking, and goal setting.""",
    version="0.1.0",
    contact={
        "name": "Personal Finance App Support",
        "url": "https://github.com/yourusername/personal-finance-app",
        "email": "support@personalfinanceapp.example.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
    # Enable Swagger UI at /docs and ReDoc at /redoc
    swagger_ui_parameters={"syntaxHighlight.theme": "obsidian"},
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, custom_rate_limit_exceeded_handler)

# Include the API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to the Personal Finance API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}