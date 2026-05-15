def validate_email(email: str) -> bool:
    """
    Basic email validation.
    For production, consider using a more robust method or library.
    """
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password: str) -> bool:
    """
    Validate password strength.
    Requires at least 8 characters, one uppercase, one lowercase, one digit.
    """
    import re
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"\d", password):
        return False
    return True

def sanitize_input(text: str) -> str:
    """
    Basic input sanitization to prevent XSS.
    For production, consider using a proper HTML escaping library.
    """
    if not text:
        return ""
    # Replace HTML special characters
    text = text.replace("&", "&amp;")
    text = text.replace("<", "&lt;")
    text = text.replace(">", "&gt;")
    text = text.replace('"', "&quot;")
    text = text.replace("'", "&#x27;")
    return text