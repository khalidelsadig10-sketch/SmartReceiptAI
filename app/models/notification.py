from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class NotificationModel(Base):
    __tablename__ = "notifications"

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
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # =========================================================
    # Notification Information
    # =========================================================

    type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # =========================================================
    # Status
    # =========================================================

    is_read: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        index=True,
    )

    # =========================================================
    # Optional Reference
    # =========================================================

    reference_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    # =========================================================
    # Metadata
    # =========================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )

    # =========================================================
    # Relationship
    # =========================================================

    user = relationship(
        "UserModel",
        back_populates="notifications",
    )