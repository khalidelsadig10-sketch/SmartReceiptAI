from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
)


# =========================================================
# Register
# =========================================================

class RegisterRequest(BaseModel):

    full_name: str = Field(
        min_length=2,
        max_length=255,
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )


# =========================================================
# Login
# =========================================================

class LoginRequest(BaseModel):

    email: EmailStr

    password: str


# =========================================================
# User Response
# =========================================================

class UserResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int

    full_name: str | None = None

    email: EmailStr

    profile_image: str | None = None

    is_active: bool
    role: str

    created_at: datetime


# =========================================================
# Authentication Response
# =========================================================

class AuthResponse(BaseModel):

    success: bool

    message: str

    user: UserResponse

    access_token: str

    token_type: str = "bearer"


# =========================================================
# Forgot Password
# =========================================================

class ForgotPasswordRequest(BaseModel):

    email: EmailStr


class ForgotPasswordResponse(BaseModel):

    success: bool

    message: str


# =========================================================
# Reset Password
# =========================================================

class ResetPasswordRequest(BaseModel):

    token: str = Field(
        min_length=32,
        max_length=256,
    )

    new_password: str = Field(
        min_length=8,
        max_length=128,
    )


class ResetPasswordResponse(BaseModel):

    success: bool

    message: str


# =========================================================
# Profile Update
# =========================================================

class ProfileUpdateRequest(BaseModel):

    full_name: str = Field(
        min_length=2,
        max_length=255,
    )
# =========================================================
# Change Password Request
# =========================================================

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str