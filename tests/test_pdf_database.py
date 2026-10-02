from pathlib import Path

from app.core.database import SessionLocal
from app.core.mock_vision_engine import MockVisionEngine
from app.models.receipt import ReceiptModel
from app.services.receipt.pdf_receipt_processor import (
    PDFReceiptProcessor,
)
from app.services.receipt_pipeline import ReceiptPipeline


PDF_PATH = Path("test_files/sample.pdf")


def test_pdf_receipts_are_saved_to_database(test_user):
    assert PDF_PATH.exists(), (
        f"Test PDF not found: {PDF_PATH}"
    )

    pipeline = ReceiptPipeline(
        vision_engine=MockVisionEngine()
    )

    processor = PDFReceiptProcessor(
        pipeline=pipeline
    )

    receipts = processor.process(
        str(PDF_PATH),
        user_id=test_user.id,
    )

    assert receipts
    assert len(receipts) >= 1

    db = SessionLocal()

    try:
        for receipt in receipts:
            assert receipt is not None

            merchant_name = (
                receipt.merchant.name
                if receipt.merchant
                else None
            )

            total = (
                receipt.financial.total
                if receipt.financial
                else None
            )

            query = db.query(ReceiptModel)

            query = query.filter(
                ReceiptModel.user_id
                == test_user.id
            )

            if merchant_name is not None:
                query = query.filter(
                    ReceiptModel.merchant_name
                    == merchant_name
                )

            if total is not None:
                query = query.filter(
                    ReceiptModel.total
                    == total
                )

            saved_receipt = (
                query.order_by(
                    ReceiptModel.id.desc()
                )
                .first()
            )

            assert saved_receipt is not None

            assert (
                saved_receipt.merchant_name
                == merchant_name
            )

            assert (
                saved_receipt.total
                == total
            )

            assert (
                saved_receipt.user_id
                == test_user.id
            )

    finally:
        db.close()

    print("\n===== PDF DATABASE TEST =====")
    print(f"PDF: {PDF_PATH}")
    print(
        f"Receipts processed: {len(receipts)}"
    )
    print("\nPDF DATABASE TEST PASSED")