from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/personalfinance"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)