from pathlib import Path
from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app
from app.services.receipt_pipeline import ReceiptPipeline
from tests.test_mock_vision_engine import MockVisionEngine


client = TestClient(app)

TEST_IMAGE = (
    Path(__file__).resolve().parent.parent
    / "test_images"
    / "vb.jpg"
)


def test_process_receipt_end_to_end():
    assert TEST_IMAGE.exists(), (
        f"Test image not found: {TEST_IMAGE}"
    )

    from app.api.routes.receipt import get_receipt_pipeline

    app.dependency_overrides[get_receipt_pipeline] = (
        lambda: ReceiptPipeline(
            vision_engine=MockVisionEngine()
        )
    )

    try:
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

        assert response.status_code == 200

        data = response.json()

        assert data["success"] is True

        assert "receipt" in data
        assert "merchant" in data["receipt"]
        assert "receipt_info" in data["receipt"]
        assert "items" in data["receipt"]
        assert "financial" in data["receipt"]
        assert "payment" in data["receipt"]

        assert "validation" in data
        assert "is_valid" in data["validation"]

        assert "database" in data
        assert data["database"]["saved"] is True
        assert isinstance(
            data["database"]["receipt_id"],
            int,
        )
        assert data["database"]["receipt_id"] > 0

    finally:
        app.dependency_overrides.clear()


def test_get_active_integration_key():
    response = client.get("/api/v1/integrations/active-key")
    assert response.status_code == 200
    data = response.json()
    assert "api_key" in data
    assert "system_name" in data
    assert len(data["api_key"]) > 0


def test_receive_digital_receipt_auto():
    # 1. Get active key
    key_resp = client.get("/api/v1/integrations/active-key")
    assert key_resp.status_code == 200
    api_key = key_resp.json()["api_key"]

    # 2. Post digital receipt with unique invoice number
    inv_num = f"INV-TEST-{uuid4().hex[:6]}"
    payload = {
        "receipt_number": inv_num,
        "customer_name": "Test Patient",
        "items": [{"name": "Test Consultation", "quantity": 1, "price": 150.0}],
        "currency": "SDG",
        "total": 150.0,
        "subtotal": 150.0,
        "receipt_date": "2026-10-07",
        "payment_method": "Cash",
    }
    response = client.post(
        "/api/v1/integrations/digital-receipt",
        headers={"Authorization": f"Bearer {api_key}"},
        json=payload,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "receipt_id" in data
