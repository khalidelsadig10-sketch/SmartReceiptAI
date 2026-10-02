from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)

TEST_IMAGES = [
    Path("test_images/aa.jpg"),
    Path("test_images/ar.jpg"),
    Path("test_images/vb.jpg"),
    Path("test_images/ii.jpg"),
]


def test_process_receipts_batch():
    files = []

    opened_files = []

    try:
        for image_path in TEST_IMAGES:
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

        response = client.post(
            "/api/v1/receipt/process-batch",
            files=files,
        )

        assert response.status_code == 200

        data = response.json()

        assert data["total_files"] == 4
        assert data["processed"] + data["failed"] == 4

        assert isinstance(data["results"], list)
        assert len(data["results"]) == 4

        for result in data["results"]:
            assert "filename" in result
            assert "success" in result

            if result["success"]:
                assert result["receipt"] is not None
                assert result["validation"] is not None
                assert result["database"] is not None
                assert result["database"]["saved"] is True
                assert result["database"]["receipt_id"] is not None

    finally:
        for file_object in opened_files:
            file_object.close()