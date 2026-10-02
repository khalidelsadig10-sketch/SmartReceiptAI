from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# =========================================================
# User Settings Response
# =========================================================

class UserSettingsResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int

    user_id: int

    language: str

    currency: str

    timezone: str

    email_notifications: bool

    processing_notifications: bool

    created_at: datetime

    updated_at: datetime


# =========================================================
# User Settings Update
# =========================================================

class UserSettingsUpdateRequest(BaseModel):

    language: str = Field(
        min_length=2,
        max_length=10,
    )

    currency: str = Field(
        min_length=2,
        max_length=10,
    )

    timezone: str = Field(
        min_length=2,
        max_length=100,
    )

    email_notifications: bool

    processing_notifications: bool