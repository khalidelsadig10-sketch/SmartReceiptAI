from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ReceiptModel(Base):
    __tablename__ = "receipts"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
        index=True,
    )

    merchant_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    merchant_category: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    merchant_address: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    merchant_phone: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    invoice_number: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    receipt_date: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    user = relationship(
        "UserModel",
        back_populates="receipts",
    )

    receipt_time: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    currency: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    subtotal: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    tax: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    tax_rate: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    discount: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    total: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    payment_method: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    qr_detected: Mapped[bool | None] = mapped_column(
        Boolean,
        nullable=True,
    )

    qr_type: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    qr_data: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
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

    items = relationship(
        "ReceiptItemModel",
        back_populates="receipt",
        cascade="all, delete-orphan",
    )

    vision_analyses = relationship(
        "VisionAnalysisModel",
        back_populates="receipt",
        cascade="all, delete-orphan",
    )

    images = relationship(
        "ReceiptImageModel",
        back_populates="receipt",
        cascade="all, delete-orphan",
    )