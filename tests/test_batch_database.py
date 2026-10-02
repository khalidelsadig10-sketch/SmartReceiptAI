from pathlib import Path

from fastapi.testclient import TestClient

from app.core.database import SessionLocal
from app.main import app
from app.models.receipt import ReceiptModel
from app.models.receipt_item import ReceiptItemModel
from app.models.receipt_image import ReceiptImageModel
from app.models.vision_analysis import VisionAnalysisModel


client = TestClient(app)


TEST_IMAGES = [
    Path("test_images/aa.jpg"),
    Path("test_images/ar.jpg"),
    Path("test_images/vb.jpg"),
    Path("test_images/ii.jpg"),
]


def test_batch_receipts_are_saved_to_database(
    override_receipt_pipeline,
):
    files = []
    opened_files = []

    try:
        for image_path in TEST_IMAGES:
            assert image_path.exists(), (
                f"Test image not found: {image_path}"
            )

            file_object = open(
                image_path,
                "rb",
            )

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

        assert data["success"] is True
        assert data["total_files"] == 4
        assert data["processed"] + data["failed"] == 4
        assert len(data["results"]) == 4

        successful_results = [
            result
            for result in data["results"]
            if result["success"]
        ]

        assert len(successful_results) == 4

        db = SessionLocal()

        try:
            for result in successful_results:
                receipt_id = (
                    result["database"]["receipt_id"]
                )

                assert receipt_id is not None

                receipt = (
                    db.query(ReceiptModel)
                    .filter(
                        ReceiptModel.id
                        == receipt_id
                    )
                    .first()
                )

                assert receipt is not None

                items = (
                    db.query(ReceiptItemModel)
                    .filter(
                        ReceiptItemModel.receipt_id
                        == receipt_id
                    )
                    .all()
                )

                assert len(items) == len(
                    result["receipt"]["items"]
                )

                images = (
                    db.query(ReceiptImageModel)
                    .filter(
                        ReceiptImageModel.receipt_id
                        == receipt_id
                    )
                    .all()
                )

                assert len(images) >= 1

                for image in images:
                    assert image.file_name
                    assert image.file_path

                analyses = (
                    db.query(VisionAnalysisModel)
                    .filter(
                        VisionAnalysisModel.receipt_id
                        == receipt_id
                    )
                    .all()
                )

                assert len(analyses) >= 1

                for analysis in analyses:
                    assert analysis.model_name
                    assert analysis.status == "success"

        finally:
            db.close()

    finally:
        for file_object in opened_files:
            file_object.close()