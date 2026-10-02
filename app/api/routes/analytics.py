from collections.abc import Generator

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.core.database import SessionLocal
from app.models.user import UserModel
from app.schemas.analytics import (
    AnalyticsResponse,
)
from app.services.analytics_service import (
    AnalyticsService,
)


router = APIRouter(
    prefix="/api/v1/analytics",
    tags=["Analytics"],
)


# =========================================================
# Database Dependency
# =========================================================

def get_db() -> Generator[
    Session,
    None,
    None,
]:
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================================================
# Analytics Overview
# =========================================================

@router.get(
    "/overview",
    response_model=AnalyticsResponse,
)
def get_analytics_overview(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(
        get_current_user
    ),
):

    analytics = (
        AnalyticsService.get_analytics(
            db=db,
            user_id=current_user.id,
        )
    )

    return {
        "success": True,
        "data": analytics,
    }