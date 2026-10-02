from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user, get_db
from app.models.user import UserModel
from app.models.user_settings import UserSettingsModel
from app.schemas.settings import (
    UserSettingsResponse,
    UserSettingsUpdateRequest,
)


# =========================================================
# Router
# =========================================================

router = APIRouter(
    prefix="/api/v1/settings",
    tags=["Settings"],
)


# =========================================================
# Default Settings
# =========================================================

DEFAULT_LANGUAGE = "en"
DEFAULT_CURRENCY = "SDG"
DEFAULT_TIMEZONE = "Africa/Khartoum"

DEFAULT_EMAIL_NOTIFICATIONS = True
DEFAULT_PROCESSING_NOTIFICATIONS = True


# =========================================================
# Get Current User Settings
# =========================================================

@router.get(
    "",
    response_model=UserSettingsResponse,
)
def get_settings(
    current_user: UserModel = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    settings = db.scalar(
        select(UserSettingsModel).where(
            UserSettingsModel.user_id
            == current_user.id
        )
    )

    # ---------------------------------------------------------
    # Create default settings if they do not exist
    # ---------------------------------------------------------

    if settings is None:

        settings = UserSettingsModel(
            user_id=current_user.id,
            language=DEFAULT_LANGUAGE,
            currency=DEFAULT_CURRENCY,
            timezone=DEFAULT_TIMEZONE,
            email_notifications=(
                DEFAULT_EMAIL_NOTIFICATIONS
            ),
            processing_notifications=(
                DEFAULT_PROCESSING_NOTIFICATIONS
            ),
        )

        db.add(settings)
        db.commit()
        db.refresh(settings)

    return settings


# =========================================================
# Update Current User Settings
# =========================================================

@router.put(
    "",
    response_model=UserSettingsResponse,
)
def update_settings(
    data: UserSettingsUpdateRequest,
    current_user: UserModel = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    # ---------------------------------------------------------
    # Validate Language
    # ---------------------------------------------------------

    allowed_languages = {
        "en",
        "ar",
    }

    if data.language not in allowed_languages:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Unsupported language. "
                "Allowed values: en, ar."
            ),
        )

    # ---------------------------------------------------------
    # Validate Currency
    # ---------------------------------------------------------

    allowed_currencies = {
        "SDG",
        "USD",
        "EUR",
        "GBP",
    }

    if data.currency not in allowed_currencies:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Unsupported currency. "
                "Allowed values: SDG, USD, EUR, GBP."
            ),
        )

    # ---------------------------------------------------------
    # Get Existing Settings
    # ---------------------------------------------------------

    settings = db.scalar(
        select(UserSettingsModel).where(
            UserSettingsModel.user_id
            == current_user.id
        )
    )

    # ---------------------------------------------------------
    # Create Settings If Missing
    # ---------------------------------------------------------

    if settings is None:

        settings = UserSettingsModel(
            user_id=current_user.id,
        )

        db.add(settings)

    # ---------------------------------------------------------
    # Update Values
    # ---------------------------------------------------------

    settings.language = data.language
    settings.currency = data.currency
    settings.timezone = data.timezone

    settings.email_notifications = (
        data.email_notifications
    )

    settings.processing_notifications = (
        data.processing_notifications
    )

    settings.updated_at = datetime.utcnow()

    # ---------------------------------------------------------
    # Save
    # ---------------------------------------------------------

    try:

        db.commit()
        db.refresh(settings)

    except Exception as exc:

        db.rollback()

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail="Unable to save settings.",
        ) from exc

    return settings