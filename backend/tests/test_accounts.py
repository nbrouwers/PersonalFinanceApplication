import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.session import Base, get_db
from app.models.user import User
from app.models.account import Account
from app.utils.security import get_password_hash

# Create an in-memory SQLite database for testing
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the test database tables
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_create_account():
    # First, we need to create a user to associate the account with
    # We'll create a user directly in the database for simplicity
    db = TestingSessionLocal()
    hashed_password = get_password_hash("testpassword")
    test_user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=hashed_password,
        is_active=True
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    db.close()

    # Now, we can create an account for this user
    response = client.post(
        "/accounts/",
        json={
            "name": "Test Checking",
            "account_type": "checking",
            "balance": 1000.0
        },
        headers={"Authorization": f"Bearer test-token"}  # This will fail because we don't have a real token
    )

    # Since we are not testing the authentication in this unit test,
    # we should override the get_current_active_user dependency as well.
    # However, for simplicity, let's just test the service function directly.

    # We'll instead test the account creation function in the service layer.
    # But we don't have a service layer for accounts yet.

    # Given the time, let's just test that the endpoint exists and returns something.
    # We'll skip the authentication for now by mocking the dependency.

    # Actually, let's do it properly by overriding the get_current_active_user dependency.

    # We'll create a mock user and override the dependency.

    from app.utils.security import get_current_active_user

    def override_get_current_active_user():
        return test_user

    app.dependency_overrides[get_current_active_user] = override_get_current_active_user

    # Now, we can test the endpoint without worrying about the token
    response = client.post(
        "/accounts/",
        json={
            "name": "Test Checking",
            "account_type": "checking",
            "balance": 1000.0
        }
    )

    # Remove the override
    app.dependency_overrides.pop(get_current_active_user, None)

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Checking"
    assert data["account_type"] == "checking"
    assert data["balance"] == 1000.0
    assert "id" in data

    # Clean up
    db = TestingSessionLocal()
    db.query(Account).filter(Account.id == data["id"]).delete()
    db.query(User).filter(User.id == test_user.id).delete()
    db.commit()
    db.close()

def test_read_accounts():
    # We'll create a user and an account for this test
    db = TestingSessionLocal()
    hashed_password = get_password_hash("testpassword")
    test_user = User(
        email="test2@example.com",
        username="testuser2",
        hashed_password=hashed_password,
        is_active=True
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)

    test_account = Account(
        name="Test Savings",
        account_type="savings",
        balance=500.0,
        user_id=test_user.id
    )
    db.add(test_account)
    db.commit()
    db.refresh(test_account)
    db.close()

    # Override the get_current_active_user dependency
    from app.utils.security import get_current_active_user

    def override_get_current_active_user():
        return test_user

    app.dependency_overrides[get_current_active_user] = override_get_current_active_user

    response = client.get("/accounts/")
    app.dependency_overrides.pop(get_current_active_user, None)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Test Savings"
    assert data[0]["account_type"] == "savings"
    assert data[0]["balance"] == 500.0

    # Clean up
    db = TestingSessionLocal()
    db.query(Account).filter(Account.id == test_account.id).delete()
    db.query(User).filter(User.id == test_user.id).delete()
    db.commit()
    db.close()

# We'll add more tests for update and delete as needed, but for now, let's move on to the next task.