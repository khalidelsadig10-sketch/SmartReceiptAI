from app.schemas.receipt import (
    BatchReceiptItem,
    BatchReceiptProcessResponse,
    DatabaseResponse,
    Merchant,
    Receipt,
    ReceiptInfo,
    ReceiptItem,
    ReceiptProcessResponse,
    ValidationResponse,
)


def build_receipt() -> Receipt:
    return Receipt(
        merchant=Merchant(
            name="FRESHCART",
            category="SUPERMARKET",
            address="123 Green Valley Rd, Springfield, USA",
            phone=None,
        ),
        receipt_info=ReceiptInfo(
            invoice_number="87654",
            date="2023-10-26",
            time="10:45",
            currency="USD",
        ),
        items=[
            ReceiptItem(
                name="ORGANIC APPLES",
                quantity=None,
                unit_price=None,
                total_price=4.48,
            ),
            ReceiptItem(
                name="BANANAS",
                quantity=0.75,
                unit_price=2.99,
                total_price=0.52,
            ),
        ],
        financial={
            "subtotal": None,
            "tax": None,
            "tax_rate": 8.5,
            "discount": None,
            "total": 52.31,
        },
        payment={
            "method": "CARD",
        },
    )


def test_receipt_schema():
    receipt = build_receipt()

    assert receipt.merchant.name == "FRESHCART"
    assert receipt.receipt_info.invoice_number == "87654"
    assert len(receipt.items) == 2
    assert receipt.financial.total == 52.31
    assert receipt.payment.method == "CARD"


def test_receipt_process_response_schema():
    receipt = build_receipt()

    response = ReceiptProcessResponse(
        success=True,
        receipt=receipt,
        validation=ValidationResponse(
            is_valid=True,
            warnings=[],
            errors=[],
        ),
        database=DatabaseResponse(
            saved=True,
            receipt_id=1,
        ),
    )

    assert response.success is True
    assert response.validation.is_valid is True
    assert response.database.saved is True
    assert response.database.receipt_id == 1


def test_batch_receipt_process_response_schema():
    receipt = build_receipt()

    result = BatchReceiptItem(
        filename="receipt_001.jpg",
        success=True,
        receipt=receipt,
        validation=ValidationResponse(
            is_valid=True,
        ),
        database=DatabaseResponse(
            saved=True,
            receipt_id=10,
        ),
    )

    response = BatchReceiptProcessResponse(
        success=True,
        total_files=1,
        processed=1,
        failed=0,
        results=[result],
    )

    assert response.success is True
    assert response.total_files == 1
    assert response.processed == 1
    assert response.failed == 0
    assert len(response.results) == 1
    assert response.results[0].filename == "receipt_001.jpg"
    assert response.results[0].database.receipt_id == 10


def test_batch_receipt_failed_item():
    result = BatchReceiptItem(
        filename="bad_file.jpg",
        success=False,
        error="Receipt processing failed.",
    )

    response = BatchReceiptProcessResponse(
        success=True,
        total_files=1,
        processed=0,
        failed=1,
        results=[result],
    )

    assert response.success is True
    assert response.processed == 0
    assert response.failed == 1
    assert response.results[0].success is False
    assert response.results[0].error == "Receipt processing failed."