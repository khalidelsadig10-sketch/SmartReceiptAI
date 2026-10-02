from app.core.database import SessionLocal
from app.core.openai_vision_engine import OpenAIVisionEngine
from app.core.product_normalizer import ProductNormalizer
from app.core.currency_normalizer import CurrencyNormalizer
from app.core.receipt_validator import ReceiptValidator
from app.services.receipt_storage import ReceiptStorage
from app.services.qr_code_reader import QRCodeReader
from app.core.financial_recovery import FinancialRecovery


class ReceiptPipeline:

    def __init__(self, vision_engine=None):

        self.vision_engine = (
            vision_engine
            if vision_engine is not None
            else OpenAIVisionEngine()
        )

        self.product_normalizer = ProductNormalizer()
        self.financial_recovery = FinancialRecovery()
        self.currency_normalizer = CurrencyNormalizer()

        self.validator = ReceiptValidator()
        self.storage = ReceiptStorage()
        self.qr_reader = QRCodeReader()

    def process(
        self,
        image_path: str,
        user_id: int,
    ) -> dict:

        db = SessionLocal()

        try:

            receipt = self.vision_engine.analyze(
                image_path
            )

            print(
                "VISION RAW CURRENCY:",
                repr(receipt.receipt_info.currency)
            )

            try:
                qr_result = self.qr_reader.read(
                    image_path
                )

                receipt.qr_detected = (
                    qr_result.get("detected", False)
                )
                receipt.qr_type = (
                    qr_result.get("qr_type")
                )
                receipt.qr_data = (
                    qr_result.get("data")
                )

            except Exception:
                receipt.qr_detected = False
                receipt.qr_type = None
                receipt.qr_data = None

            receipt = self.currency_normalizer.normalize(
                receipt
            )

            print(
                "AFTER CURRENCY NORMALIZER:",
                repr(receipt.receipt_info.currency)
            )

            receipt = self.product_normalizer.normalize(
                receipt
            )

            print(
                "AFTER PRODUCT NORMALIZER:",
                repr(receipt.receipt_info.currency)
            )

            receipt = self.financial_recovery.normalize(
                receipt
            )

            print(
                "AFTER FINANCIAL RECOVERY:",
                repr(receipt.receipt_info.currency)
            )

            validation = self.validator.validate(
                receipt
            )

            print(
                "BEFORE STORAGE:",
                repr(receipt.receipt_info.currency)
            )

            saved_receipt = self.storage.save(
                db=db,
                receipt=receipt,
                image_path=image_path,
                model_name=self.vision_engine.model,
                user_id=user_id,
            )

            return {
                "success": validation.is_valid,

                "receipt": receipt,

                "validation": {
                    "is_valid": validation.is_valid,
                    "warnings": validation.warnings,
                    "errors": validation.errors,
                },

                "database": {
                    "saved": True,
                    "receipt_id": saved_receipt.id,
                },
            }

        except Exception:

            db.rollback()
            raise

        finally:

            db.close()