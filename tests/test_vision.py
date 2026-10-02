import os
from pathlib import Path

import pytest

from app.core.openai_vision_engine import (
    OpenAIVisionEngine,
)


IMAGE_PATH = Path("test_images/aa.jpg")


@pytest.mark.live
def test_vision():
    if not os.getenv("OPENAI_API_KEY"):
        pytest.skip(
            "OPENAI_API_KEY is not configured."
        )

    assert IMAGE_PATH.exists(), (
        f"Test image not found: {IMAGE_PATH}"
    )

    engine = OpenAIVisionEngine()

    receipt = engine.analyze(
        str(IMAGE_PATH)
    )

    assert receipt is not None
    assert receipt.merchant is not None
    assert receipt.receipt_info is not None
    assert receipt.items is not None
    assert receipt.financial is not None
    assert receipt.payment is not None

    print("\n===== OPENAI VISION TEST =====")
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