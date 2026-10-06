import secrets
from datetime import datetime

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class IntegrationSettingModel(Base):
    __tablename__ = "integration_settings"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    system_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    organization_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    api_key: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
        index=True,
        default=lambda: secrets.token_urlsafe(32),
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Connected",
    )

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

    receipts = relationship(
        "ReceiptModel",
        back_populates="integration",
    )
