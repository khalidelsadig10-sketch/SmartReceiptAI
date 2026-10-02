from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)

PDF_PATH = Path("test_files/sample.pdf")


def test_process_pdf_receipt(
    override_receipt_pipeline,
):
    assert PDF_PATH.exists(), (
        f"Test PDF not found: {PDF_PATH}"
    )

    with open(
        PDF_PATH,
        "rb",
    ) as file:
        response = client.post(
            "/api/v1/receipt/process-pdf",
            files={
                "file": (
                    PDF_PATH.name,
                    file,
                    "application/pdf",
                )
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert data["filename"] == PDF_PATH.name

    assert data["total_receipts"] >= 1
    assert isinstance(
        data["receipts"],
        list,
    )

    assert (
        len(data["receipts"])
        == data["total_receipts"]
    )

    for receipt in data["receipts"]:
        assert receipt is not None

        assert receipt["merchant"] is not None
        assert (
            receipt["receipt_info"]
            is not None
        )
        assert receipt["items"] is not None
        assert (
            receipt["financial"]
            is not None
        )
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

    print("\n===== PDF API MOCK TEST =====")
    print(f"PDF: {PDF_PATH}")
    print(
        f"Receipts returned: "
        f"{data['total_receipts']}"
    )
    print("\nPDF API MOCK TEST PASSED")