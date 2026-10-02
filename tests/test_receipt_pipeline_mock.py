from pathlib import Path

from app.core.mock_vision_engine import MockVisionEngine
from app.services.receipt_pipeline import ReceiptPipeline


IMAGE_PATH = Path("test_images/aa.jpg")


def test_receipt_pipeline_with_mock_vision(test_user):

    assert IMAGE_PATH.exists(), (
        f"Test image not found: {IMAGE_PATH}"
    )

    pipeline = ReceiptPipeline(
        vision_engine=MockVisionEngine()
    )

    result = pipeline.process(
        str(IMAGE_PATH),
        user_id=test_user.id,
    )

    assert result is not None

    assert result["success"] is True

    assert result["receipt"] is not None
    assert result["validation"] is not None
    assert result["database"] is not None

    assert result["database"]["saved"] is True
    assert result["database"]["receipt_id"] is not None

    receipt = result["receipt"]

    assert receipt.merchant is not None
    assert receipt.receipt_info is not None
    assert receipt.items is not None
    assert receipt.financial is not None
    assert receipt.payment is not None

    print("\n===== MOCK RECEIPT PIPELINE =====")
    print(
        f"Merchant: {receipt.merchant.name}"
    )
    print(
        f"Items: {len(receipt.items)}"
    )
    print(
        f"Total: {receipt.financial.total}"
    )
    print(
        f"Database ID: "
        f"{result['database']['receipt_id']}"
    )

    print(
        "\nMOCK RECEIPT PIPELINE TEST PASSED"
    )