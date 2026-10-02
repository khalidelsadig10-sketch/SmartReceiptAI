import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI

# =========================================================
# ENSURE DIRECTORIES EXIST (for cloud deployment)
# =========================================================

Path("uploads").mkdir(exist_ok=True)

from fastapi.staticfiles import StaticFiles
from app.api.routes import intelligence
from app.api.routes import admin
from app.api.routes.auth import router as auth_router
from app.api.routes.receipt import router as receipt_router
from app.api.routes.dashboard import router as dashboard_router
from app.web.routes import router as web_router
from app.api.routes import analytics
from app.core.database import engine
from app.api.routes import reports
from app.models.password_reset_token import (
    PasswordResetTokenModel,
)
from app.models.user_session import (
    UserSessionModel,
)
from app.models.user_settings import (
    UserSettingsModel,
)
from app.api.routes.settings import (
    router as settings_router,
)
from app.api.routes.notifications import (
    router as notifications_router,
)

app = FastAPI(
    title="SmartReceiptAI V2",
    version="1.0.0",
    description=(
        "AI-powered receipt and invoice processing API."
    ),
)


# =========================================================
# DATABASE INITIALIZATION
# =========================================================
from app.database_init import initialize_database

try:
    initialize_database()
except Exception as e:
    print(f"Warning during core database initialization: {e}")

# =========================================================
# ADDITIONAL TABLES
# =========================================================

PasswordResetTokenModel.__table__.create(
    bind=engine,
    checkfirst=True,
)
UserSessionModel.__table__.create(
    bind=engine,
    checkfirst=True,
)
UserSettingsModel.__table__.create(
    bind=engine,
    checkfirst=True,
)

# =========================================================
# FRONTEND ASSETS
# =========================================================

app.mount(
    "/assets",
    StaticFiles(
        directory="frontend/assets"
    ),
    name="assets",
)


# =========================================================
# UPLOADS
# =========================================================

app.mount(
    "/uploads",
    StaticFiles(
        directory="uploads"
    ),
    name="uploads",
)


# =========================================================
# HEALTH
# =========================================================

@app.get("/health")
def health():

    return {
        "success": True,
        "status": "healthy",
    }


# =========================================================
# ROUTERS
# =========================================================

app.include_router(
    web_router
)

app.include_router(
    auth_router
)

app.include_router(
    receipt_router
)
app.include_router(
    reports.router
)

app.include_router(
    dashboard_router
)
app.include_router(
    analytics.router
)
app.include_router(
    intelligence.router
)
app.include_router(
    settings_router
)
app.include_router(
    notifications_router
)
app.include_router(
    admin.router
)