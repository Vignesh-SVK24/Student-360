from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import jwt
from app.core.config import settings
from app.core.exceptions import UnauthorizedException


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT access token."""
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": now, "type": "access"})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(data: Dict[str, Any], remember_me: bool = False) -> str:
    """Create a signed JWT refresh token with standard or extended validity."""
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    days = settings.REFRESH_TOKEN_REMEMBER_DAYS if remember_me else settings.REFRESH_TOKEN_EXPIRE_DAYS
    expire = now + timedelta(days=days)
    to_encode.update({"exp": expire, "iat": now, "type": "refresh", "remember_me": remember_me})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_password_reset_token(email: str) -> str:
    """Create a short-lived single-use password reset token."""
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=settings.PASSWORD_RESET_EXPIRE_MINUTES)
    payload = {"sub": email, "type": "reset", "exp": expire, "iat": now}
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str, expected_type: Optional[str] = None) -> Dict[str, Any]:
    """Decode and validate a signed JWT token."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        if expected_type and payload.get("type") != expected_type:
            raise UnauthorizedException(f"Invalid token type: expected {expected_type}", "INVALID_TOKEN_TYPE")
        return payload
    except jwt.ExpiredSignatureError:
        raise UnauthorizedException("Token has expired", "TOKEN_EXPIRED")
    except jwt.InvalidTokenError:
        raise UnauthorizedException("Invalid authentication token", "INVALID_TOKEN")