from pathlib import Path

from app.core.pdf_processor import PDFProcessor
from app.schemas.receipt import Receipt
from app.services.receipt_pipeline import ReceiptPipeline


class PDFReceiptProcessor:

    def __init__(
        self,
        pipeline: ReceiptPipeline | None = None,
    ):
        self.pdf_processor = PDFProcessor()
        self.pipeline = (
            pipeline or ReceiptPipeline()
        )

    def process(
        self,
        pdf_path: str,
        user_id: int,
    ) -> list[Receipt]:

        path = Path(pdf_path)

        if not path.exists():
            raise FileNotFoundError(
                f"PDF file not found: {pdf_path}"
            )

        if path.suffix.lower() != ".pdf":
            raise ValueError(
                "Only PDF files are supported."
            )

        image_paths = (
            self.pdf_processor.convert_to_images(
                str(path)
            )
        )

        receipts: list[Receipt] = []

        for image_path in image_paths:
            result = self.pipeline.process(
                image_path,
                user_id=user_id,
            )

            receipt = result.get("receipt")

            if receipt is not None:
                receipts.append(receipt)

        return receipts