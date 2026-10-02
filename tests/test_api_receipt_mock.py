from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app


IMAGE_PATH = Path("test_images/aa.jpg")


def test_process_receipt_api_with_mock_vision(
    override_receipt_pipeline,
):
    assert IMAGE_PATH.exists(), (
        f"Test image not found: {IMAGE_PATH}"
    )

    client = TestClient(app)

    with open(IMAGE_PATH, "rb") as file:
        response = client.post(
            "/api/v1/receipt/process",
            files={
                "file": (
                    IMAGE_PATH.name,
                    file,
                    "image/jpeg",
                )
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True

    assert data["receipt"] is not None
    assert data["validation"] is not None
    assert data["database"] is not None

    receipt = data["receipt"]

    assert receipt["merchant"] is not None
    assert receipt["receipt_info"] is not None
    assert receipt["items"] is not None
    assert receipt["financial"] is not None
    assert receipt["payment"] is not None

    assert (
        receipt["merchant"]["name"]
        == "MOCK MERCHANT"
    )

    assert len(receipt["items"]) == 2

    assert (
        receipt["financial"]["total"]
        == 27.5
    )

    assert data["database"]["saved"] is True

    assert (
        data["database"]["receipt_id"]
        is not None
    )

    print("\n===== API MOCK TEST =====")
    print(
        f"Merchant: "
        f"{receipt['merchant']['name']}"
    )
    print(
        f"Items: "
        f"{len(receipt['items'])}"
    )
    print(
        f"Total: "
        f"{receipt['financial']['total']}"
    )
    print(
        f"Database ID: "
        f"{data['database']['receipt_id']}"
    )

    print("\nAPI MOCK TEST PASSED")