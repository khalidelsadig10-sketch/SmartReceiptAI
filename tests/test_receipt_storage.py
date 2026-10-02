from pathlib import Path

from app.core.database import SessionLocal
from app.services.receipt_pipeline import ReceiptPipeline
from app.services.receipt_storage import ReceiptStorage
from tests.test_mock_vision_engine import MockVisionEngine


IMAGE_PATH = Path("test_images/aa.jpg")


def test_receipt_storage(test_user):
    assert IMAGE_PATH.exists(), (
        f"Test image not found: {IMAGE_PATH}"
    )

    db = SessionLocal()

    try:
        pipeline = ReceiptPipeline(
            vision_engine=MockVisionEngine()
        )

        result = pipeline.process(
            str(IMAGE_PATH),
            user_id=test_user.id,
        )

        receipt = result["receipt"]

        assert receipt is not None

        storage = ReceiptStorage()

        saved_receipt = storage.save(
            db=db,
            receipt=receipt,
            image_path=str(IMAGE_PATH),
            model_name="mock-vision",
            user_id=test_user.id,
        )

        assert saved_receipt.id is not None

        assert (
            saved_receipt.merchant_name
            == receipt.merchant.name
        )

        assert (
            saved_receipt.currency
            == receipt.receipt_info.currency
        )

        assert (
            len(saved_receipt.items)
            == len(receipt.items)
        )

        assert len(saved_receipt.images) >= 1
        assert len(saved_receipt.vision_analyses) >= 1

    finally:
        db.close()