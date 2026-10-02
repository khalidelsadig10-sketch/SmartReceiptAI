from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ReceiptItemModel(Base):
    __tablename__ = "receipt_items"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    receipt_id: Mapped[int] = mapped_column(
        ForeignKey("receipts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    quantity: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    unit_price: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    total_price: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    receipt = relationship(
        "ReceiptModel",
        back_populates="items",
    )