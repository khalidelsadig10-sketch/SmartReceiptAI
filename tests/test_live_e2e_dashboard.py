import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.main import app


TEST_IMAGE = (
    Path(__file__).resolve().parent.parent
    / "test_images"
    / "aa.jpg"
)

client = TestClient(app)


@pytest.mark.live
def test_real_openai_e2e_to_dashboard():
    # =====================================================
    # Configuration
    # =====================================================

    if not os.getenv("OPENAI_API_KEY"):
        pytest.skip(
            "OPENAI_API_KEY is not configured."
        )

    # =====================================================
    # Test Image
    # =====================================================

    assert TEST_IMAGE.exists(), (
        f"Test image not found: {TEST_IMAGE}"
    )

    # =====================================================
    # Step 1 — Real Receipt API
    # =====================================================

    with TEST_IMAGE.open("rb") as image_file:
        response = client.post(
            "/api/v1/receipt/process",
            files={
                "file": (
                    TEST_IMAGE.name,
                    image_file,
                    "image/jpeg",
                )
            },
        )

    assert response.status_code == 200, (
        f"Receipt API failed: "
        f"{response.status_code} "
        f"{response.text}"
    )

    api_data = response.json()

    # =====================================================
    # Step 2 — Receipt API Contract
    # =====================================================

    assert api_data["success"] is True

    assert "receipt" in api_data
    assert "validation" in api_data
    assert "database" in api_data

    receipt = api_data["receipt"]
    database = api_data["database"]

    assert receipt["merchant"] is not None
    assert receipt["receipt_info"] is not None
    assert receipt["items"] is not None
    assert receipt["financial"] is not None
    assert receipt["payment"] is not None

    assert database["saved"] is True

    receipt_id = database["receipt_id"]

    assert isinstance(receipt_id, int)
    assert receipt_id > 0

    # =====================================================
    # Step 3 — Dashboard Statistics
    # =====================================================

    stats_response = client.get(
        "/api/v1/dashboard/stats"
    )

    assert stats_response.status_code == 200

    stats_data = stats_response.json()

    assert stats_data["success"] is True
    assert "data" in stats_data

    stats = stats_data["data"]

    assert stats["total_receipts"] >= 1
    assert stats["total_items"] >= 0
    assert stats["total_amount"] >= 0
    assert stats["average_receipt"] >= 0

    # =====================================================
    # Step 4 — Dashboard Recent Receipts
    # =====================================================

    recent_response = client.get(
        "/api/v1/dashboard/recent"
    )

    assert recent_response.status_code == 200

    recent_data = recent_response.json()

    assert recent_data["success"] is True
    assert "receipts" in recent_data
    assert recent_data["total"] >= 1

    recent_ids = [
        item["id"]
        for item in recent_data["receipts"]
    ]

    assert receipt_id in recent_ids

    # =====================================================
    # Step 5 — Dashboard Receipt Details
    # =====================================================

    details_response = client.get(
        f"/api/v1/dashboard/receipts/{receipt_id}"
    )

    assert details_response.status_code == 200

    details_data = details_response.json()

    assert details_data["success"] is True
    assert "data" in details_data

    details = details_data["data"]

    assert details["id"] == receipt_id

    assert "items" in details
    assert "images" in details
    assert "vision_analyses" in details

    assert isinstance(
        details["items"],
        list,
    )

    assert isinstance(
        details["images"],
        list,
    )

    assert isinstance(
        details["vision_analyses"],
        list,
    )

    # =====================================================
    # Step 6 — Final E2E Report
    # =====================================================

    print("\n")
    print("=" * 60)
    print("REAL OPENAI E2E → DASHBOARD")
    print("=" * 60)

    print(
        f"Receipt ID: {receipt_id}"
    )

    print(
        f"Merchant: "
        f"{details['merchant_name']}"
    )

    print(
        f"Invoice: "
        f"{details['invoice_number']}"
    )

    print(
        f"Items: "
        f"{len(details['items'])}"
    )

    print(
        f"Total: "
        f"{details['total']}"
    )

    print(
        f"Images: "
        f"{len(details['images'])}"
    )

    print(
        f"Vision Analyses: "
        f"{len(details['vision_analyses'])}"
    )

    print("=" * 60)
    print("REAL E2E SUCCESS")
    print("=" * 60)