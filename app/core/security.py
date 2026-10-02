from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash

from app.core.config import settings


# =========================================================
# Password Hashing
# =========================================================

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return password_hash.verify(
        plain_password,
        hashed_password,
    )


# =========================================================
# JWT
# =========================================================

def create_access_token(
    user_id: int,
    session_id: str | None = None,
    expires_minutes: int = 60,
) -> str:

    expire = (
        datetime.now(timezone.utc)
        + timedelta(minutes=expires_minutes)
    )

    payload = {
        "sub": str(user_id),
        "exp": expire,
    }

    # Add session ID when session tracking is enabled
    if session_id:
        payload["session_id"] = session_id

    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


# =========================================================
# Decode JWT
# =========================================================

def decode_access_token(
    token: str,
) -> dict:

    return jwt.decode(
        token,
        settings.JWT_SECRET_KEY,
        algorithms=[
            settings.JWT_ALGORITHM
        ],
    )