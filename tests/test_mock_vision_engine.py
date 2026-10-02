from pathlib import Path

from app.core.mock_vision_engine import MockVisionEngine


IMAGE_PATH = Path("test_images/aa.jpg")


def test_mock_vision_engine():

    assert IMAGE_PATH.exists(), (
        f"Test image not found: {IMAGE_PATH}"
    )

    engine = MockVisionEngine()

    receipt = engine.analyze(
        str(IMAGE_PATH)
    )

    assert receipt is not None

    assert receipt.merchant is not None
    assert receipt.receipt_info is not None
    assert receipt.items is not None
    assert receipt.financial is not None
    assert receipt.payment is not None

    assert len(receipt.items) >= 1

    assert receipt.financial.total is not None

    print("\n===== MOCK VISION ENGINE =====")
    print(f"Merchant: {receipt.merchant.name}")
    print(f"Items: {len(receipt.items)}")
    print(f"Total: {receipt.financial.total}")

    print("\nMOCK VISION ENGINE TEST PASSED")