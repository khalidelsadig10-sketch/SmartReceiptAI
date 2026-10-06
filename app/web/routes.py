from pathlib import Path

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse

from app.api.routes.auth import require_admin
from app.models.user import UserModel


# =========================================================
# Paths
# =========================================================

BASE_DIR = Path(__file__).resolve().parents[2]

FRONTEND_DIR = BASE_DIR / "frontend"
PAGES_DIR = FRONTEND_DIR / "pages"


# =========================================================
# Router
# =========================================================

router = APIRouter()


# =========================================================
# Welcome Page
# =========================================================

@router.get(
    "/",
    include_in_schema=False,
)
async def home():
    return FileResponse(
        PAGES_DIR / "index.html"
    )


# =========================================================
# Login Page
# =========================================================

@router.get(
    "/login",
    include_in_schema=False,
)
async def login_page():
    return FileResponse(
        PAGES_DIR / "login.html"
    )


# =========================================================
# Forgot Password Page
# =========================================================

@router.get(
    "/forgot-password",
    include_in_schema=False,
)
async def forgot_password_page():
    return FileResponse(
        PAGES_DIR / "forgot-password.html"
    )


# =========================================================
# Reset Password Page
# =========================================================

@router.get(
    "/reset-password",
    include_in_schema=False,
)
async def reset_password_page():
    return FileResponse(
        PAGES_DIR / "reset-password.html"
    )


# =========================================================
# Register Page
# =========================================================

@router.get(
    "/register",
    include_in_schema=False,
)
async def register_page():
    return FileResponse(
        PAGES_DIR / "register.html"
    )


# =========================================================
# Dashboard Page
# =========================================================

@router.get(
    "/dashboard",
    include_in_schema=False,
)
async def dashboard_page():
    return FileResponse(
        PAGES_DIR / "dashboard.html"
    )


# =========================================================
# Receipts Page
# =========================================================

@router.get(
    "/receipts",
    include_in_schema=False,
)
async def receipts_page():
    return FileResponse(
        PAGES_DIR / "receipts.html"
    )


# =========================================================
# Profile Page
# =========================================================

@router.get(
    "/profile",
    include_in_schema=False,
)
async def profile_page():
    return FileResponse(
        PAGES_DIR / "profile.html"
    )


# =========================================================
# Reports Page
# =========================================================

@router.get(
    "/reports",
    include_in_schema=False,
)
async def reports_page():
    return FileResponse(
        PAGES_DIR / "reports.html"
    )


# =========================================================
# AI Intelligence Page
# =========================================================

@router.get(
    "/intelligence",
    include_in_schema=False,
)
async def intelligence_page():
    return FileResponse(
        PAGES_DIR / "intelligence.html"
    )


# =========================================================
# Analytics Page
# =========================================================

@router.get(
    "/analytics",
    include_in_schema=False,
)
async def analytics_page():
    return FileResponse(
        PAGES_DIR / "analytics.html"
    )


# =========================================================
# Security Page
# =========================================================

@router.get(
    "/security",
    include_in_schema=False,
)
async def security_page():
    return FileResponse(
        PAGES_DIR / "security.html"
    )


# =========================================================
# Settings Page
# =========================================================

@router.get(
    "/settings",
    include_in_schema=False,
)
async def settings_page():
    return FileResponse(
        PAGES_DIR / "settings.html"
    )


# =========================================================
# Notifications Page
# =========================================================

@router.get(
    "/notifications",
    include_in_schema=False,
)
async def notifications_page():
    return FileResponse(
        PAGES_DIR / "notifications.html"
    )


# =========================================================
# Admin Page
# =========================================================

@router.get(
    "/admin",
    include_in_schema=False,
)
async def admin_page(
    current_user: UserModel = Depends(
        require_admin
    ),
):
    return FileResponse(
        PAGES_DIR / "admin.html"
    )

# =========================================================
# Demo POS Page
# =========================================================

@router.get(
    "/demo-pos",
    include_in_schema=False,
)
async def demo_pos_page():
    return FileResponse(
        PAGES_DIR / "demo_pos.html"
    )