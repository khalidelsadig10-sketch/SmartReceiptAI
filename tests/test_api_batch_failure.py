from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app
from app.services.receipt_pipeline import ReceiptPipeline
from tests.test_mock_vision_engine import MockVisionEngine


client = TestClient(app)


def test_batch_with_invalid_file():
    image_paths = [
        Path("test_images/aa.jpg"),
        Path("test_images/ar.jpg"),
        Path("test_images/vb.jpg"),
    ]

    opened_files = []
    files = []

    try:
        for image_path in image_paths:
            assert image_path.exists(), (
                f"Test image not found: {image_path}"
            )

            file_object = open(image_path, "rb")
            opened_files.append(file_object)

            files.append(
                (
                    "files",
                    (
                        image_path.name,
                        file_object,
                        "image/jpeg",
                    ),
                )
            )

        files.append(
            (
                "files",
                (
                    "invalid.pdf",
                    b"fake pdf content",
                    "application/pdf",
                ),
            )
        )

        from app.api.routes.receipt import get_receipt_pipeline

        app.dependency_overrides[get_receipt_pipeline] = (
            lambda: ReceiptPipeline(
                vision_engine=MockVisionEngine()
            )
        )

        response = client.post(
            "/api/v1/receipt/process-batch",
            files=files,
        )

        assert response.status_code == 200

        data = response.json()

        assert data["total_files"] == 4
        assert data["processed"] == 3
        assert data["failed"] == 1

        assert len(data["results"]) == 4

        successful_results = [
            result
            for result in data["results"]
            if result["success"] is True
        ]

        failed_results = [
            result
            for result in data["results"]
            if result["success"] is False
        ]

        assert len(successful_results) == 3
        assert len(failed_results) == 1

        assert failed_results[0]["filename"] == "invalid.pdf"
        assert failed_results[0]["error"] is not None

    finally:
        app.dependency_overrides.clear()

        for file_object in opened_files:
            file_object.close()