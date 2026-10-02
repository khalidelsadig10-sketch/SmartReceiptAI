from pathlib import Path

from app.services.receipt.pdf_receipt_processor import (
    PDFReceiptProcessor,
)
from app.services.receipt_pipeline import ReceiptPipeline
from tests.test_mock_vision_engine import MockVisionEngine


PDF_PATH = Path("test_files/sample.pdf")


def test_pdf_receipt_processor(test_user):
    assert PDF_PATH.exists(), (
        f"Test PDF not found: {PDF_PATH}"
    )

    pipeline = ReceiptPipeline(
        vision_engine=MockVisionEngine()
    )

    processor = PDFReceiptProcessor(
        pipeline=pipeline
    )

    receipts = processor.process(
        str(PDF_PATH),
        user_id=test_user.id,
    )

    assert receipts
    assert len(receipts) >= 1

    for receipt in receipts:
        assert receipt is not None
        assert receipt.merchant is not None
        assert receipt.receipt_info is not None
        assert receipt.items is not None
        assert receipt.financial is not None
        assert receipt.payment is not None

    print("\n===== PDF RECEIPT PROCESSOR =====")
    print(f"PDF: {PDF_PATH}")
    print(
        f"Receipts generated: {len(receipts)}"
    )

    for index, receipt in enumerate(
        receipts,
        start=1,
    ):
        print(
            f"Page {index}: "
            f"items={len(receipt.items)}, "
            f"total={receipt.financial.total}"
        )

    print(
        "\nPDF RECEIPT PROCESSOR TEST PASSED"
    )