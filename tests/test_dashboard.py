from datetime import datetime

from fastapi.testclient import TestClient
from app.models.user import UserModel
from app.core.database import SessionLocal
from app.main import app
from app.models.receipt import ReceiptModel
from app.models.receipt_image import ReceiptImageModel
from app.models.receipt_item import ReceiptItemModel
from app.models.vision_analysis import VisionAnalysisModel


client = TestClient(app)


def _create_test_receipt(user_id: int) -> int:
    db = SessionLocal()

    try:
        receipt = ReceiptModel(
            user_id=user_id,

            merchant_name="Dashboard Test Store",
            merchant_category="Retail",
            merchant_address="Test Address",
            merchant_phone="000000000",
            invoice_number="DASH-001",
            receipt_date="2026-08-10",
            receipt_time="12:00:00",
            currency="SDG",
            subtotal=1000.0,
            tax=150.0,
            tax_rate=15.0,
            discount=50.0,
            total=1100.0,
            payment_method="Cash",
        )

        db.add(receipt)
        db.flush()

        db.add(
            ReceiptItemModel(
                receipt_id=receipt.id,
                name="Test Product",
                quantity=2.0,
                unit_price=500.0,
                total_price=1000.0,
            )
        )

        db.add(
            ReceiptImageModel(
                receipt_id=receipt.id,
                file_name="dashboard-test.jpg",
                file_path="uploads/test/dashboard-test.jpg",
                mime_type="image/jpeg",
            )
        )

        db.add(
            VisionAnalysisModel(
                receipt_id=receipt.id,
                model_name="mock-vision",
                status="success",
                raw_response='{"test": true}',
            )
        )

        db.commit()

        return receipt.id

    finally:
        db.close()


def test_dashboard_stats():
    response = client.get(
        "/api/v1/dashboard/stats"
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body

    data = body["data"]

    assert "total_receipts" in data
    assert "total_items" in data
    assert "total_amount" in data
    assert "average_receipt" in data
    assert "total_tax" in data
    assert "total_discount" in data
    assert "successful_vision_analyses" in data
    assert "failed_vision_analyses" in data


def test_dashboard_recent_receipts(test_user):
    receipt_id = _create_test_receipt(
        test_user.id
    )

    response = client.get(
        "/api/v1/dashboard/recent"
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "receipts" in body
    assert body["total"] >= 1

    receipt_ids = [
        receipt["id"]
        for receipt in body["receipts"]
    ]

    assert receipt_id in receipt_ids


def test_dashboard_recent_receipts_limit():
    response = client.get(
        "/api/v1/dashboard/recent?limit=1"
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert body["total"] <= 1
    assert len(body["receipts"]) <= 1


def test_dashboard_receipt_details(test_user):
    receipt_id = _create_test_receipt(
        test_user.id
    )

    response = client.get(
        f"/api/v1/dashboard/receipts/{receipt_id}"
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body

    data = body["data"]

    assert data["id"] == receipt_id
    assert data["merchant_name"] == "Dashboard Test Store"
    assert data["invoice_number"] == "DASH-001"
    assert data["currency"] == "SDG"
    assert data["total"] == 1100.0

    assert len(data["items"]) >= 1
    assert data["items"][0]["name"] == "Test Product"

    assert len(data["images"]) >= 1
    assert (
        data["images"][0]["file_name"]
        == "dashboard-test.jpg"
    )

    assert len(data["vision_analyses"]) >= 1
    assert (
        data["vision_analyses"][0]["model_name"]
        == "mock-vision"
    )


def test_dashboard_receipt_not_found():
    response = client.get(
        "/api/v1/dashboard/receipts/999999999"
    )

    assert response.status_code == 404

    body = response.json()

    assert body["detail"] == "Receipt not found."