from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    # =========================================================
    # User Information
    # =========================================================

    full_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    profile_image: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    # =========================================================
    # Authentication
    # =========================================================

    password_hash: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
        # =========================================================
    # Authorization
    # =========================================================

    role: Mapped[str] = mapped_column(
        String(20),
        default="user",
        nullable=False,
        index=True,
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
    # Relationships
    # =========================================================

    receipts = relationship(
        "ReceiptModel",
        back_populates="user",
    )
    settings = relationship(
        "UserSettingsModel",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    notifications = relationship(
        "NotificationModel",
        back_populates="user",
        cascade="all, delete-orphan",
    )