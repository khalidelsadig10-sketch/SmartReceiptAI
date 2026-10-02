import json
from pathlib import Path

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.receipt import ReceiptModel
from app.models.receipt_item import ReceiptItemModel
from app.models.receipt_image import ReceiptImageModel
from app.models.vision_analysis import VisionAnalysisModel
from app.schemas.receipt import Receipt


class ReceiptRepository:

    def __init__(self, db: Session):
        self.db = db

    # =========================================================
    # Save Receipt
    # =========================================================

    def save_receipt(
        self,
        receipt: Receipt,
        image_path: str | None = None,
        raw_response: str | None = None,
        vision_status: str = "success",
        user_id: int | None = None,
    ) -> ReceiptModel:

        receipt_model = ReceiptModel(
            user_id=user_id,

            merchant_name=receipt.merchant.name,
            merchant_category=receipt.merchant.category,
            merchant_address=receipt.merchant.address,
            merchant_phone=receipt.merchant.phone,

            invoice_number=receipt.receipt_info.invoice_number,
            receipt_date=receipt.receipt_info.date,
            receipt_time=receipt.receipt_info.time,
            currency=receipt.receipt_info.currency,

            subtotal=receipt.financial.subtotal,
            tax=receipt.financial.tax,
            tax_rate=receipt.financial.tax_rate,
            discount=receipt.financial.discount,
            total=receipt.financial.total,

            payment_method=receipt.payment.method,
        )

        self.db.add(receipt_model)
        self.db.flush()

        for item in receipt.items:

            item_model = ReceiptItemModel(
                receipt_id=receipt_model.id,
                name=item.name,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total_price=item.total_price,
            )

            self.db.add(item_model)

        if image_path is not None:

            path = Path(image_path)

            image_model = ReceiptImageModel(
                receipt_id=receipt_model.id,
                file_name=path.name,
                file_path=str(path),
                mime_type=self._guess_mime_type(path),
            )

            self.db.add(image_model)

        vision_model = VisionAnalysisModel(
            receipt_id=receipt_model.id,
            model_name=settings.OPENAI_MODEL,
            status=vision_status,
            raw_response=raw_response,
            error_message=None,
        )

        self.db.add(vision_model)

        self.db.commit()
        self.db.refresh(receipt_model)

        return receipt_model

    # =========================================================
    # Get Single Receipt
    # =========================================================

    def get_receipt(
        self,
        receipt_id: int,
    ) -> ReceiptModel | None:

        return self.db.get(
            ReceiptModel,
            receipt_id,
        )

    # =========================================================
    # Get Single Receipt For User
    # =========================================================

    def get_receipt_by_user(
        self,
        receipt_id: int,
        user_id: int,
    ) -> ReceiptModel | None:

        return (
            self.db.query(ReceiptModel)
            .filter(
                ReceiptModel.id == receipt_id,
                ReceiptModel.user_id == user_id,
            )
            .first()
        )

    # =========================================================
    # Get Receipts
    # =========================================================

    def get_receipts(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[ReceiptModel], int]:

        query = (
            self.db.query(ReceiptModel)
            .filter(
                ReceiptModel.user_id == user_id
            )
            .order_by(
                ReceiptModel.created_at.desc()
            )
        )

        total = query.count()

        receipts = (
            query
            .offset(skip)
            .limit(limit)
            .all()
        )

        return receipts, total

    # =========================================================
    # Update Receipt
    # =========================================================

    def update_receipt(
        self,
        receipt_model: ReceiptModel,
        data: dict,
    ) -> ReceiptModel:

        allowed_fields = {
            "merchant_name",
            "merchant_category",
            "merchant_address",
            "merchant_phone",
            "invoice_number",
            "receipt_date",
            "receipt_time",
            "currency",
            "subtotal",
            "tax",
            "tax_rate",
            "discount",
            "total",
            "payment_method",
        }

        for field, value in data.items():

            if field in allowed_fields:
                setattr(
                    receipt_model,
                    field,
                    value,
                )

        self.db.commit()
        self.db.refresh(receipt_model)

        return receipt_model

    # =========================================================
    # Delete Receipt
    # =========================================================

    def delete_receipt(
        self,
        receipt_model: ReceiptModel,
    ) -> None:

        self.db.delete(receipt_model)
        self.db.commit()

    # =========================================================
    # MIME Type
    # =========================================================

    @staticmethod
    def _guess_mime_type(
        path: Path,
    ) -> str | None:

        extension = path.suffix.lower()

        mime_types = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".webp": "image/webp",
            ".bmp": "image/bmp",
            ".gif": "image/gif",
        }

        return mime_types.get(extension)