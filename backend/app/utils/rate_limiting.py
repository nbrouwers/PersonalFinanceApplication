from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.status import HTTP_429_TOO_MANY_REQUESTS

# Create a limiter instance
limiter = Limiter(key_func=get_remote_address)

# Custom rate limit exceeded handler
def custom_rate_limit_exceeded_handler(request: Request, exc):
    return JSONResponse(
        status_code=HTTP_429_TOO_MANY_REQUESTS,
        content={"detail": "Rate limit exceeded. Please try again later."},
    )