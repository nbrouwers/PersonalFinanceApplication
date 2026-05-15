import pytest
from app.utils.security import verify_password, get_password_hash

def test_password_hashing():
    password = "securepassword123"
    hashed = get_password_hash(password)
    
    # Check that the hashed password is not the same as the plain password
    assert hashed != password
    # Check that the hashed password is a string
    assert isinstance(hashed, str)
    # Check that the hashed password is not empty
    assert len(hashed) > 0
    
    # Check that verifying the correct password returns True
    assert verify_password(password, hashed) is True
    
    # Check that verifying an incorrect password returns False
    assert verify_password("wrongpassword", hashed) is False