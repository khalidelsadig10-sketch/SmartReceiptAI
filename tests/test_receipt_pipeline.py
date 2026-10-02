import os
from pathlib import Path

import pytest

from app.services.receipt_pipeline import (
    ReceiptPipeline,
)


IMAGE_PATH = Path("test_images/aa.jpg")


@pytest.mark.live
def test_receipt_pipeline():
    if not os.getenv("OPENAI_API_KEY"):
        pytest.skip(
            "OPENAI_API_KEY is not configured."
        )

    assert IMAGE_PATH.exists(), (
        f"Test image not found: {IMAGE_PATH}"
    )

    pipeline = ReceiptPipeline()

    result = pipeline.process(
        str(IMAGE_PATH),
        user_id=1,
    )

    assert result is not None
    assert result["success"] is True

    assert result["receipt"] is not None
    assert result["validation"] is not None
    assert result["database"] is not None

    receipt = result["receipt"]

    assert receipt.merchant is not None
    assert receipt.receipt_info is not None
    assert receipt.items is not None
    assert receipt.financial is not None
    assert receipt.payment is not None

    assert (
        result["database"]["saved"]
        is True
    )

    assert (
        result["database"]["receipt_id"]
        is not None
    )

    print("\n===== OPENAI RECEIPT PIPELINE =====")
    print(
        f"Merchant: "
        f"{receipt.merchant.name}"
    )
    print(
        f"Items: "
        f"{len(receipt.items)}"
    )
    print(
        f"Total: "
        f"{receipt.financial.total}"
    )
    print(
        f"Database ID: "
        f"{result['database']['receipt_id']}"
    )