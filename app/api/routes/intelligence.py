from collections.abc import Generator

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.core.database import SessionLocal
from app.models.user import UserModel
from app.schemas.intelligence import (
    IntelligenceResponse,
)
from app.services.intelligence_service import (
    IntelligenceService,
)


router = APIRouter(
    prefix="/api/v1/intelligence",
    tags=["AI Intelligence"],
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
# AI Intelligence Overview
# =========================================================

@router.get(
    "/overview",
    response_model=IntelligenceResponse,
)
def get_intelligence_overview(
    limit: int = Query(
        default=10,
        ge=1,
        le=50,
    ),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(
        get_current_user
    ),
):

    intelligence = (
        IntelligenceService.get_intelligence(
            db=db,
            user_id=current_user.id,
            limit=limit,
        )
    )

    return {
        "success": True,
        "data": intelligence,
    }