from pathlib import Path

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