import hashlib
import secrets
from collections.abc import Generator
from datetime import datetime, timedelta
from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Request,
    Response,
    UploadFile,
    status,
)

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.email import send_password_reset_email
from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.models.password_reset_token import (
    PasswordResetTokenModel,
)
from app.models.user import UserModel
from app.models.user_session import (
    UserSessionModel,
)
from app.schemas.auth import (
    AuthResponse,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    ProfileUpdateRequest,
    RegisterRequest,
    ResetPasswordRequest,
    ResetPasswordResponse,
    UserResponse,
)


# =========================================================
# Router
# =========================================================

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)


# =========================================================
# Profile Image Configuration
# =========================================================

PROFILE_IMAGE_DIR = Path(
    "uploads/profile_images"
)

PROFILE_IMAGE_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


ALLOWED_PROFILE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}


ALLOWED_PROFILE_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


MAX_PROFILE_IMAGE_SIZE = (
    20 * 1024 * 1024
)


# =========================================================
# Database
# =========================================================

def get_db() -> Generator[Session, None, None]:

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =========================================================
# Authentication Helpers
# =========================================================

def get_request_token(
    request: Request,
) -> str | None:

    token = request.cookies.get(
        "access_token"
    )

    if token:
        return token

    authorization = request.headers.get(
        "Authorization"
    )

    if not authorization:
        return None

    scheme, _, credentials = (
        authorization.partition(" ")
    )

    if scheme.lower() != "bearer":
        return None

    return credentials or None


def get_current_session_id(
    request: Request,
) -> str | None:

    token = get_request_token(
        request
    )

    if not token:
        return None

    try:
        payload = decode_access_token(
            token
        )

        return payload.get(
            "session_id"
        )

    except Exception:
        return None


# =========================================================
# Current User
# =========================================================

def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> UserModel:

    token = get_request_token(
        request
    )

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
        )

    try:

        payload = decode_access_token(
            token
        )

        user_id = payload.get(
            "sub"
        )

        session_id = payload.get(
            "session_id"
        )

        if user_id is None:
            raise ValueError(
                "Missing subject."
            )

        user = db.get(
            UserModel,
            int(user_id),
        )

        if session_id:

            session = db.scalar(
                select(
                    UserSessionModel
                ).where(
                    UserSessionModel.session_id
                    == session_id,
                    UserSessionModel.user_id
                    == int(user_id),
                )
            )

            if session is None:
                raise HTTPException(
                    status_code=(
                        status.HTTP_401_UNAUTHORIZED
                    ),
                    detail="Session not found.",
                )

            if session.revoked:
                raise HTTPException(
                    status_code=(
                        status.HTTP_401_UNAUTHORIZED
                    ),
                    detail=(
                        "Session has been revoked."
                    ),
                )

            if (
                session.expires_at
                <= datetime.utcnow()
            ):
                raise HTTPException(
                    status_code=(
                        status.HTTP_401_UNAUTHORIZED
                    ),
                    detail=(
                        "Session has expired."
                    ),
                )

            session.last_active_at = (
                datetime.utcnow()
            )

            db.add(session)
            db.commit()

    except HTTPException:
        raise

    except Exception as exc:

        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail=(
                "Invalid or expired "
                "authentication token."
            ),
        ) from exc

    if user is None:
        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail="User not found.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=(
                status.HTTP_403_FORBIDDEN
            ),
            detail="User account is inactive.",
        )

    return user

# =========================================================
# Admin User
# =========================================================

def require_admin(
    current_user: UserModel = Depends(
        get_current_user
    ),
) -> UserModel:

    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )

    return current_user
# =========================================================
# Password Reset Helpers
# =========================================================

def hash_reset_token(
    token: str,
) -> str:

    return hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()


def generate_reset_token() -> str:

    return secrets.token_urlsafe(
        48
    )


# =========================================================
# Register
# =========================================================

@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    data: RegisterRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):

    email = (
        data.email
        .lower()
        .strip()
    )

    existing_user = db.scalar(
        select(UserModel).where(
            UserModel.email == email
        )
    )

    if existing_user is not None:
        raise HTTPException(
            status_code=(
                status.HTTP_409_CONFLICT
            ),
            detail=(
                "An account with this "
                "email already exists."
            ),
        )

    user = UserModel(
        full_name=data.full_name.strip(),
        email=email,
        password_hash=hash_password(
            data.password
        ),
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    session_id = secrets.token_hex(
        32
    )

    expires_at = (
        datetime.utcnow()
        + timedelta(minutes=60)
    )

    client_ip = (
        request.client.host
        if request.client
        else None
    )

    user_agent = request.headers.get(
        "user-agent"
    )

    session = UserSessionModel(
        user_id=user.id,
        session_id=session_id,
        user_agent=user_agent,
        ip_address=client_ip,
        device_name="Current Device",
        expires_at=expires_at,
        last_active_at=datetime.utcnow(),
    )

    db.add(session)
    db.commit()

    token = create_access_token(
        user.id,
        session_id=session_id,
    )

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60,
        path="/",
    )

    return AuthResponse(
        success=True,
        message="Registration successful.",
        user=user,
        access_token=token,
    )


# =========================================================
# Login
# =========================================================

@router.post(
    "/login",
    response_model=AuthResponse,
)
def login(
    data: LoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):

    email = (
        data.email
        .lower()
        .strip()
    )

    user = db.scalar(
        select(UserModel).where(
            UserModel.email == email
        )
    )

    if user is None or not verify_password(
        data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail=(
                "Invalid email or password."
            ),
        )

    if not user.is_active:
        raise HTTPException(
            status_code=(
                status.HTTP_403_FORBIDDEN
            ),
            detail=(
                "User account is inactive."
            ),
        )

    session_id = secrets.token_hex(
        32
    )

    expires_at = (
        datetime.utcnow()
        + timedelta(minutes=60)
    )

    client_ip = (
        request.client.host
        if request.client
        else None
    )

    user_agent = request.headers.get(
        "user-agent"
    )

    session = UserSessionModel(
        user_id=user.id,
        session_id=session_id,
        user_agent=user_agent,
        ip_address=client_ip,
        device_name="Current Device",
        expires_at=expires_at,
        last_active_at=datetime.utcnow(),
    )

    db.add(session)
    db.commit()

    token = create_access_token(
        user.id,
        session_id=session_id,
    )

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60,
        path="/",
    )

    return AuthResponse(
        success=True,
        message="Login successful.",
        user=user,
        access_token=token,
    )


# =========================================================
# Forgot Password
# =========================================================

@router.post(
    "/forgot-password",
    response_model=ForgotPasswordResponse,
)
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):

    email = (
        data.email
        .lower()
        .strip()
    )

    generic_message = (
        "If an account exists for this email, "
        "password reset instructions have been sent."
    )

    user = db.scalar(
        select(UserModel).where(
            UserModel.email == email
        )
    )

    if user is None:
        return ForgotPasswordResponse(
            success=True,
            message=generic_message,
        )

    # Bypass email due to Railway blocking outbound SMTP
    # Directly reset the password to 12345678 for the graduation project
    user.password_hash = hash_password("12345678")
    db.commit()

    return ForgotPasswordResponse(
        success=True,
        message="تم إعادة ضبط كلمة المرور إلى 12345678 بنجاح. يرجى تسجيل الدخول بها الآن. / Password reset to 12345678. Please login.",
    )


# =========================================================
# Reset Password
# =========================================================

@router.post(
    "/reset-password",
    response_model=ResetPasswordResponse,
)
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):

    token_hash = hash_reset_token(
        data.token
    )

    reset_token = db.scalar(
        select(
            PasswordResetTokenModel
        ).where(
            PasswordResetTokenModel.token_hash
            == token_hash
        )
    )

    if reset_token is None:
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=(
                "Invalid or expired "
                "password reset link."
            ),
        )

    if reset_token.used_at is not None:
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=(
                "This password reset link "
                "has already been used."
            ),
        )

    if (
        reset_token.expires_at
        <= datetime.utcnow()
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=(
                "This password reset link "
                "has expired."
            ),
        )

    user = db.get(
        UserModel,
        reset_token.user_id,
    )

    if user is None:
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=(
                "User account could not "
                "be found."
            ),
        )

    if not user.is_active:
        raise HTTPException(
            status_code=(
                status.HTTP_403_FORBIDDEN
            ),
            detail=(
                "User account is inactive."
            ),
        )

    try:

        user.password_hash = hash_password(
            data.new_password
        )

        user.updated_at = (
            datetime.utcnow()
        )

        reset_token.used_at = (
            datetime.utcnow()
        )

        sessions = db.scalars(
            select(
                UserSessionModel
            ).where(
                UserSessionModel.user_id
                == user.id,
                UserSessionModel.revoked
                == False,
            )
        ).all()

        for session in sessions:
            session.revoked = True
            db.add(session)

        db.add(user)
        db.add(reset_token)

        db.commit()
        db.refresh(user)

    except Exception as exc:

        db.rollback()

        print(
            "Password reset database error:",
            exc,
        )

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Unable to update the password."
            ),
        ) from exc

    return ResetPasswordResponse(
        success=True,
        message=(
            "Password updated successfully. "
            "All active sessions were signed out. "
            "Please sign in again."
        ),
    )


# =========================================================
# Logout
# =========================================================

@router.post("/logout")
def logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
    current_user: UserModel | None = Depends(
        lambda: None
    ),
):
    """
    Logout the current authentication session.

    This endpoint intentionally resolves the session
    directly from the request token so the session is
    revoked before the authentication cookie is removed.
    """

    session_id = get_current_session_id(
        request
    )

    if session_id:

        session = db.scalar(
            select(
                UserSessionModel
            ).where(
                UserSessionModel.session_id
                == session_id,
            )
        )

        if session is not None:
            session.revoked = True
            db.add(session)
            db.commit()

    response.delete_cookie(
        key="access_token",
        path="/",
    )

    return {
        "success": True,
        "message": "Logged out successfully.",
    }


# =========================================================
# Current User
# =========================================================

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: UserModel = Depends(
        get_current_user
    ),
):
    return current_user


# =========================================================
# Security - Active Sessions
# =========================================================

@router.get("/sessions")
def get_sessions(
    request: Request,
    current_user: UserModel = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    current_session_id = (
        get_current_session_id(
            request
        )
    )

    sessions = db.scalars(
        select(
            UserSessionModel
        ).where(
            UserSessionModel.user_id
            == current_user.id,
            UserSessionModel.revoked
            == False,
            UserSessionModel.expires_at
            > datetime.utcnow(),
        ).order_by(
            UserSessionModel.last_active_at.desc()
        )
    ).all()

    result = []

    for session in sessions:

        is_expired = (
            session.expires_at
            <= datetime.utcnow()
        )

        result.append({
            "session_id": session.session_id,
            "device_name": session.device_name,
            "user_agent": session.user_agent,
            "ip_address": session.ip_address,
            "created_at": getattr(
                session,
                "created_at",
                None,
            ),
            "last_active_at": session.last_active_at,
            "expires_at": session.expires_at,
            "revoked": session.revoked,
            "expired": is_expired,
            "current": (
                session.session_id
                == current_session_id
            ),
        })

    return {
        "success": True,
        "sessions": result,
    }


# =========================================================
# Security - Revoke Session
# =========================================================

@router.delete(
    "/sessions/{session_id}"
)
def revoke_session(
    session_id: str,
    request: Request,
    current_user: UserModel = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    current_session_id = (
        get_current_session_id(
            request
        )
    )

    if session_id == current_session_id:
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=(
                "You cannot revoke the current "
                "session. Use logout instead."
            ),
        )

    session = db.scalar(
        select(
            UserSessionModel
        ).where(
            UserSessionModel.session_id
            == session_id,
            UserSessionModel.user_id
            == current_user.id,
        )
    )

    if session is None:
        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),
            detail="Session not found.",
        )

    if session.revoked:
        return {
            "success": True,
            "message": "Session is already revoked.",
        }

    session.revoked = True

    db.add(session)
    db.commit()

    return {
        "success": True,
        "message": "Session revoked successfully.",
        "session_id": session_id,
    }


# =========================================================
# Security - Logout Other Sessions
# =========================================================

@router.post(
    "/sessions/logout-others"
)
def logout_other_sessions(
    request: Request,
    current_user: UserModel = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    current_session_id = (
        get_current_session_id(
            request
        )
    )

    if not current_session_id:
        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail=(
                "Current session could not "
                "be identified."
            ),
        )

    sessions = db.scalars(
        select(
            UserSessionModel
        ).where(
            UserSessionModel.user_id
            == current_user.id,
            UserSessionModel.session_id
            != current_session_id,
            UserSessionModel.revoked
            == False,
            UserSessionModel.expires_at
            > datetime.utcnow(),
        )
    ).all()

    revoked_count = 0

    for session in sessions:

        session.revoked = True

        db.add(session)

        revoked_count += 1

    db.commit()

    return {
        "success": True,
        "message": (
            "All other sessions have been "
            "logged out."
        ),
        "revoked_count": revoked_count,
    }


# =========================================================
# Update Profile
# =========================================================

@router.put(
    "/profile",
    response_model=UserResponse,
)
def update_profile(
    data: ProfileUpdateRequest,
    current_user: UserModel = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    full_name = data.full_name.strip()

    if not full_name:
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=(
                "Full name cannot be empty."
            ),
        )

    current_user.full_name = full_name
    current_user.updated_at = (
        datetime.utcnow()
    )

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return current_user


# =========================================================
# Upload Profile Image
# =========================================================

@router.post(
    "/profile-image",
    response_model=UserResponse,
)
async def upload_profile_image(
    file: UploadFile = File(...),
    current_user: UserModel = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    if not file.filename:
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail="No file name provided.",
        )

    extension = Path(
        file.filename
    ).suffix.lower()

    if extension not in ALLOWED_PROFILE_EXTENSIONS:
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=(
                "Unsupported image type. "
                "Allowed types: JPG, JPEG, PNG, WEBP."
            ),
        )

    if (
        file.content_type
        not in ALLOWED_PROFILE_CONTENT_TYPES
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=(
                "Invalid image content type."
            ),
        )

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=(
                "Uploaded image is empty."
            ),
        )

    if (
        len(contents)
        > MAX_PROFILE_IMAGE_SIZE
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
            ),
            detail=(
                "Profile image exceeds "
                "the 20 MB limit."
            ),
        )

    if current_user.profile_image:

        old_path = Path(
            current_user.profile_image
        )

        if old_path.exists():

            try:
                old_path.unlink()

            except OSError:
                pass

    file_id = uuid4().hex

    image_path = (
        PROFILE_IMAGE_DIR
        / f"{file_id}{extension}"
    )

    image_path.write_bytes(
        contents
    )

    current_user.profile_image = str(
        image_path
    )

    current_user.updated_at = (
        datetime.utcnow()
    )

    db.add(current_user)

    db.commit()

    db.refresh(current_user)

    return current_user


# =========================================================
# Delete Profile Image
# =========================================================

@router.delete(
    "/profile-image",
    response_model=UserResponse,
)
def delete_profile_image(
    current_user: UserModel = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    if current_user.profile_image:

        image_path = Path(
            current_user.profile_image
        )

        if image_path.exists():

            try:
                image_path.unlink()

            except OSError:
                pass

    current_user.profile_image = None

    current_user.updated_at = (
        datetime.utcnow()
    )

    db.add(current_user)

    db.commit()

    db.refresh(current_user)

    return current_user


# =========================================================
# Change Password
# =========================================================

@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    request: Request,
    response: Response,
    current_user: UserModel = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    if not verify_password(
        data.current_password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=(
                "Current password is incorrect."
            ),
        )

    if verify_password(
        data.new_password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=(
                "New password must be different "
                "from your current password."
            ),
        )

    current_session_id = (
        get_current_session_id(
            request
        )
    )

    try:

        current_user.password_hash = (
            hash_password(
                data.new_password
            )
        )

        current_user.updated_at = (
            datetime.utcnow()
        )

        db.add(current_user)

        if current_session_id:

            current_session = db.scalar(
                select(
                    UserSessionModel
                ).where(
                    UserSessionModel.session_id
                    == current_session_id,
                    UserSessionModel.user_id
                    == current_user.id,
                )
            )

            if current_session:
                current_session.revoked = True
                db.add(current_session)

        db.commit()

    except Exception as exc:

        db.rollback()

        print(
            "Change password database error:",
            exc,
        )

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Unable to change password."
            ),
        ) from exc

    response.delete_cookie(
        key="access_token",
        path="/",
    )

    return {
        "success": True,
        "message": (
            "Password changed successfully. "
            "Please sign in again."
        ),
    }