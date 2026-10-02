from pathlib import Path
import json

from sqlalchemy.orm import Session

from app.models.receipt import ReceiptModel
from app.models.receipt_item import ReceiptItemModel
from app.models.receipt_image import ReceiptImageModel
from app.models.vision_analysis import VisionAnalysisModel
from app.models.notification import NotificationModel
from app.schemas.receipt import Receipt


class ReceiptStorage:

    def save(
        self,
        db: Session,
        receipt: Receipt,
        image_path: str,
        model_name: str,
        user_id: int,
        raw_response: dict | None = None,
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

            qr_detected=receipt.qr_detected,
            qr_type=receipt.qr_type,
            qr_data=receipt.qr_data,
        )

        db.add(receipt_model)
        db.flush()

        print(
            "DB MODEL AFTER FLUSH:",
            receipt_model.id,
            repr(receipt_model.currency)
        )

        for item in receipt.items:

            item_model = ReceiptItemModel(
                receipt_id=receipt_model.id,
                name=item.name,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total_price=item.total_price,
            )

            db.add(item_model)

        path = Path(image_path)

        image_model = ReceiptImageModel(
            receipt_id=receipt_model.id,
            file_name=path.name,
            file_path=str(path),
            mime_type=None,
        )

        db.add(image_model)

        vision_model = VisionAnalysisModel(
            receipt_id=receipt_model.id,
            model_name=model_name,
            status="success",
            raw_response=(
                json.dumps(
                    raw_response,
                    ensure_ascii=False,
                )
                if raw_response is not None
                else None
            ),
            error_message=None,
        )

        db.add(vision_model)

        notification = NotificationModel(
            user_id=user_id,
            type="receipt_processed",
            title="Receipt Processed",
            message=(
                f"Your receipt from "
                f"{receipt.merchant.name or 'Unknown Merchant'} "
                f"was processed successfully."
            ),
            is_read=False,
            reference_id=receipt_model.id,
        )

        db.add(notification)

        db.commit()

        db.refresh(receipt_model)
        
        return receipt_model