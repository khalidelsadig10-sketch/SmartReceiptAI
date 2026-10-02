from io import BytesIO

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_root():
    response = client.get("/")

    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    assert response.text


def test_health():
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert data["status"] == "healthy"


def test_process_receipt_unsupported_file():
    response = client.post(
        "/api/v1/receipt/process",
        files={
            "file": (
                "test.pdf",
                b"fake pdf content",
                "application/pdf",
            )
        },
    )

    assert response.status_code == 400

    data = response.json()

    assert (
        data["detail"]
        == "Unsupported file type. "
        "Allowed types: JPG, JPEG, PNG, WEBP."
    )


def test_process_receipt_empty_file():
    response = client.post(
        "/api/v1/receipt/process",
        files={
            "file": (
                "empty.jpg",
                BytesIO(b""),
                "image/jpeg",
            )
        },
    )

    assert response.status_code == 400

    data = response.json()

    assert data["detail"] == "Uploaded file is empty."