from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class UserSettingsModel(Base):
    __tablename__ = "user_settings"

    # =========================================================
    # Primary Key
    # =========================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    # =========================================================
    # User Relationship
    # =========================================================

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True,
        nullable=False,
        index=True,
    )

    # =========================================================
    # General Preferences
    # =========================================================

    language: Mapped[str] = mapped_column(
        String(10),
        default="en",
        nullable=False,
    )

    currency: Mapped[str] = mapped_column(
        String(10),
        default="SDG",
        nullable=False,
    )

    timezone: Mapped[str] = mapped_column(
        String(100),
        default="Africa/Khartoum",
        nullable=False,
    )

    # =========================================================
    # Notification Preferences
    # =========================================================

    email_notifications: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    processing_notifications: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # =========================================================
    # Metadata
    # =========================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    # =========================================================
    # Relationship
    # =========================================================

    user = relationship(
        "UserModel",
        back_populates="settings",
    )