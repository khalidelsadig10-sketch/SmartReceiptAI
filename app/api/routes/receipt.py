import logging
from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from fastapi.responses import (
    FileResponse,
    StreamingResponse,
)
from openpyxl import Workbook
from sqlalchemy import select

from app.api.routes.auth import get_current_user
from app.core.database import SessionLocal
from app.models.receipt import ReceiptModel
from app.models.user import UserModel
from app.schemas.receipt import (
    BatchReceiptItem,
    BatchReceiptProcessResponse,
    ReceiptProcessResponse,
)
from app.services.receipt.pdf_receipt_processor import (
    PDFReceiptProcessor,
)
from app.services.receipt_pipeline import ReceiptPipeline
from app.services.receipt_repository import ReceiptRepository
from app.services.notification_service import NotificationService

# =========================================================
# Logger
# =========================================================

logger = logging.getLogger(__name__)


# =========================================================
# Router
# =========================================================

router = APIRouter(
    prefix="/api/v1/receipt",
    tags=["Receipt"],
)


# =========================================================
# Directories
# =========================================================

UPLOAD_DIR = Path("uploads/receipts")
UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

PDF_UPLOAD_DIR = Path("uploads/pdfs")
PDF_UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =========================================================
# File Configuration
# =========================================================

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}

PDF_EXTENSION = ".pdf"

MAX_FILE_SIZE = 10 * 1024 * 1024
MAX_BATCH_FILES = 100


# =========================================================
# Dependencies
# =========================================================

def get_receipt_pipeline() -> ReceiptPipeline:
    """
    Create the production receipt pipeline.
    """

    return ReceiptPipeline()


# =========================================================
# Get Receipts
# =========================================================

@router.get("/")
async def get_receipts(
    skip: int = 0,
    limit: int = 20,
    current_user: UserModel = Depends(
        get_current_user
    ),
):
    db = SessionLocal()

    try:

        repository = ReceiptRepository(db)

        receipts, total = repository.get_receipts(
            user_id=current_user.id,
            skip=skip,
            limit=limit,
        )

        return {
            "success": True,
            "total": total,
            "skip": skip,
            "limit": limit,
            "receipts": [
                {
                    "id": receipt.id,

                    # Image
                    "image_url": (
                        f"/api/v1/receipt/"
                        f"{receipt.id}/image"
                        if receipt.images
                        else None
                    ),

                    # Merchant
                    "merchant_name": (
                        receipt.merchant_name
                    ),
                    "merchant_category": (
                        receipt.merchant_category
                    ),
                    "merchant_address": (
                        receipt.merchant_address
                    ),
                    "merchant_phone": (
                        receipt.merchant_phone
                    ),

                    # Receipt
                    "invoice_number": (
                        receipt.invoice_number
                    ),
                    "receipt_date": (
                        receipt.receipt_date
                    ),
                    "receipt_time": (
                        receipt.receipt_time
                    ),

                    # Financial
                    "currency": receipt.currency,
                    "subtotal": receipt.subtotal,
                    "tax": receipt.tax,
                    "tax_rate": receipt.tax_rate,
                    "discount": receipt.discount,
                    "total": receipt.total,

                    # Payment
                    "payment_method": (
                        receipt.payment_method
                    ),

                    # Vision
                    "vision_status": (
                        receipt.vision_analyses[-1].status
                        if receipt.vision_analyses
                        else None
                    ),

                    # Metadata
                    "created_at": (
                        receipt.created_at.isoformat()
                        if receipt.created_at
                        else None
                    ),
                    "updated_at": (
                        receipt.updated_at.isoformat()
                        if receipt.updated_at
                        else None
                    ),

                    # Items
                    "items_count": len(
                        receipt.items
                    ),
                }
                for receipt in receipts
            ],
        }

    except Exception as exc:

        logger.exception(
            "Failed to retrieve receipts."
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve receipts.",
        ) from exc

    finally:
        db.close()


# =========================================================
# Single Image Receipt Processing
# =========================================================

@router.post(
    "/process",
    response_model=ReceiptProcessResponse,
)
async def process_receipt(
    file: UploadFile = File(...),
    pipeline: ReceiptPipeline = Depends(
        get_receipt_pipeline
    ),
    current_user: UserModel = Depends(
        get_current_user
    ),
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file name provided.",
        )

    extension = Path(
        file.filename
    ).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Allowed types: JPG, JPEG, PNG, WEBP."
            ),
        )

    # =========================================================
    # Check Free Trial Limit
    # =========================================================
    if current_user.role != "admin":
        db = SessionLocal()
        try:
            repository = ReceiptRepository(db)
            _, total = repository.get_receipts(user_id=current_user.id, limit=1)
            if total >= 3:
                raise HTTPException(
                    status_code=403,
                    detail="عفواً، لقد استنفدت رصيدك المجاني (3 فواتير). يرجى ترقية حسابك للمزيد. / Free trial limit reached (max 3 receipts). Please upgrade your account."
                )
        finally:
            db.close()

    file_id = uuid4().hex

    image_path = (
        UPLOAD_DIR
        / f"{file_id}{extension}"
    )

    try:

        contents = await file.read()

        if not contents:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty.",
            )

        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=(
                    "File size exceeds the 10 MB limit."
                ),
            )

        image_path.write_bytes(
            contents
        )

        logger.info(
            "Processing receipt for user_id=%s: %s",
            current_user.id,
            file.filename,
        )

        result = pipeline.process(
            str(image_path),
            user_id=current_user.id,
        )

        # =====================================================
        # Create Notification
        # =====================================================

        notification_db = SessionLocal()

        try:

            receipt = (
                notification_db.query(
                    ReceiptModel
                )
                .filter(
                    ReceiptModel.user_id
                    == current_user.id
                )
                .order_by(
                    ReceiptModel.id.desc()
                )
                .first()
            )

            if receipt:

                NotificationService.create(
                    db=notification_db,
                    user_id=current_user.id,
                    notification_type="receipt_processed",
                    title="Receipt Processed",
                    message=(
                        "Your receipt has been successfully "
                        "processed and analyzed."
                    ),
                    reference_id=receipt.id,
                )

                notification_db.commit()

                logger.info(
                    "Receipt notification created "
                    "for user_id=%s, receipt_id=%s",
                    current_user.id,
                    receipt.id,
                )

        except Exception:

            notification_db.rollback()

            logger.exception(
                "Failed to create receipt notification "
                "for user_id=%s",
                current_user.id,
            )

        finally:

            notification_db.close()

        return result

    except HTTPException:
        raise

    except FileNotFoundError as exc:

        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        logger.exception(
            "Receipt processing failed."
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Receipt processing failed. "
                "Please try again."
            ),
        ) from exc
# =========================================================
# PDF Receipt Processing
# =========================================================

@router.post(
    "/process-pdf",
)
async def process_pdf_receipt(
    file: UploadFile = File(...),
    pipeline: ReceiptPipeline = Depends(
        get_receipt_pipeline
    ),
    current_user: UserModel = Depends(
        get_current_user
    ),
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file name provided.",
        )

    extension = Path(
        file.filename
    ).suffix.lower()

    if extension != PDF_EXTENSION:
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported.",
        )

    # =========================================================
    # Check Free Trial Limit
    # =========================================================
    if current_user.role != "admin":
        db = SessionLocal()
        try:
            repository = ReceiptRepository(db)
            _, total = repository.get_receipts(user_id=current_user.id, limit=1)
            if total >= 3:
                raise HTTPException(
                    status_code=403,
                    detail="عفواً، لقد استنفدت رصيدك المجاني (3 فواتير). يرجى ترقية حسابك للمزيد. / Free trial limit reached (max 3 receipts). Please upgrade your account."
                )
        finally:
            db.close()

    try:

        contents = await file.read()

        if not contents:
            raise HTTPException(
                status_code=400,
                detail="Uploaded PDF is empty.",
            )

        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=(
                    "File size exceeds the 10 MB limit."
                ),
            )

        file_id = uuid4().hex

        pdf_path = (
            PDF_UPLOAD_DIR
            / f"{file_id}.pdf"
        )

        pdf_path.write_bytes(
            contents
        )

        logger.info(
            "Processing PDF for user_id=%s: %s",
            current_user.id,
            file.filename,
        )

        processor = PDFReceiptProcessor(
            pipeline=pipeline
        )

        receipts = processor.process(
            str(pdf_path),
            user_id=current_user.id,
        )

        return {
            "success": True,
            "filename": file.filename,
            "total_receipts": len(receipts),
            "receipts": [
                receipt.model_dump()
                if hasattr(
                    receipt,
                    "model_dump",
                )
                else receipt
                for receipt in receipts
            ],
        }

    except HTTPException:
        raise

    except FileNotFoundError as exc:

        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        logger.exception(
            "PDF receipt processing failed."
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "PDF receipt processing failed. "
                "Please try again."
            ),
        ) from exc


# =========================================================
# Batch Receipt Processing
# =========================================================

@router.post(
    "/process-batch",
    response_model=BatchReceiptProcessResponse,
)
async def process_receipts_batch(
    files: list[UploadFile] = File(...),
    pipeline: ReceiptPipeline = Depends(
        get_receipt_pipeline
    ),
    current_user: UserModel = Depends(
        get_current_user
    ),
):
    if not files:
        raise HTTPException(
            status_code=400,
            detail="No files provided.",
        )

    if len(files) > MAX_BATCH_FILES:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Too many files. Maximum allowed is "
                f"{MAX_BATCH_FILES} files per request."
            ),
        )

    # =========================================================
    # Check Free Trial Limit
    # =========================================================
    if current_user.role != "admin":
        db = SessionLocal()
        try:
            repository = ReceiptRepository(db)
            _, total = repository.get_receipts(user_id=current_user.id, limit=1)
            
            # They want to upload `len(files)` receipts. If current total + new files > 3, block them.
            if total + len(files) > 3:
                raise HTTPException(
                    status_code=403,
                    detail=f"عفواً، لقد استنفدت رصيدك المجاني. رصيدك الحالي {total} وتحاول رفع {len(files)} فواتير إضافية. يرجى الترقية. / Free trial limit reached. You have {total} receipts and are trying to upload {len(files)} more. Please upgrade."
                )
        finally:
            db.close()

    results = []
    processed = 0
    failed = 0

    for file in files:

        filename = (
            file.filename or "unknown"
        )

        try:

            if not file.filename:
                raise ValueError(
                    "No file name provided."
                )

            extension = Path(
                file.filename
            ).suffix.lower()

            if extension not in ALLOWED_EXTENSIONS:
                raise ValueError(
                    "Unsupported file type. "
                    "Allowed types: JPG, JPEG, PNG, WEBP."
                )

            contents = await file.read()

            if not contents:
                raise ValueError(
                    "Uploaded file is empty."
                )

            if len(contents) > MAX_FILE_SIZE:
                raise ValueError(
                    "File size exceeds the 10 MB limit."
                )

            file_id = uuid4().hex

            image_path = (
                UPLOAD_DIR
                / f"{file_id}{extension}"
            )

            image_path.write_bytes(
                contents
            )

            logger.info(
                "Batch processing for user_id=%s: %s",
                current_user.id,
                filename,
            )

            result = pipeline.process(
                str(image_path),
                user_id=current_user.id,
            )

            results.append(
                BatchReceiptItem(
                    filename=filename,
                    success=True,
                    receipt=result["receipt"],
                    validation=result["validation"],
                    database=result["database"],
                )
            )

            processed += 1

        except Exception as exc:

            logger.exception(
                "Batch processing failed for %s",
                filename,
            )

            results.append(
                BatchReceiptItem(
                    filename=filename,
                    success=False,
                    error=str(exc),
                )
            )

            failed += 1

    return BatchReceiptProcessResponse(
        success=processed > 0,
        total_files=len(files),
        processed=processed,
        failed=failed,
        results=results,
    )


# =========================================================
# Export Receipts To Excel
# =========================================================

@router.post(
    "/export/excel"
)
async def export_receipts_excel(
    data: dict,
    current_user: UserModel = Depends(
        get_current_user
    ),
):
    db = SessionLocal()

    try:

        receipt_ids = data.get(
            "receipt_ids",
            [],
        )

        if not isinstance(
            receipt_ids,
            list,
        ):
            raise HTTPException(
                status_code=400,
                detail="Invalid receipt_ids.",
            )

        normalized_ids = []

        for receipt_id in receipt_ids:

            try:
                normalized_ids.append(
                    int(receipt_id)
                )

            except (
                TypeError,
                ValueError,
            ):
                continue

        # Remove duplicates while keeping order
        receipt_ids = list(
            dict.fromkeys(
                normalized_ids
            )
        )

        if not receipt_ids:
            raise HTTPException(
                status_code=400,
                detail=(
                    "No receipts selected for export."
                ),
            )

        receipts = (
            db.query(
                ReceiptModel
            )
            .filter(
                ReceiptModel.id.in_(
                    receipt_ids
                ),
                ReceiptModel.user_id
                == current_user.id,
            )
            .all()
        )

        if not receipts:
            raise HTTPException(
                status_code=404,
                detail="No receipts found.",
            )

        receipt_map = {
            receipt.id: receipt
            for receipt in receipts
        }

        ordered_receipts = [
            receipt_map[receipt_id]
            for receipt_id in receipt_ids
            if receipt_id in receipt_map
        ]

        workbook = Workbook()

        worksheet = (
            workbook.active
        )

        worksheet.title = "Receipts"

        headers = [
            "Receipt ID",
            "Merchant",
            "Category",
            "Invoice Number",
            "Date",
            "Time",
            "Items",
            "Subtotal",
            "Tax",
            "Tax Rate",
            "Discount",
            "Total",
            "Currency",
            "Payment Method",
            "Vision Status",
        ]

        worksheet.append(
            headers
        )

        for cell in worksheet[1]:

            cell.font = cell.font.copy(
                bold=True
            )

        for receipt in ordered_receipts:

            vision_status = (
                receipt.vision_analyses[-1].status
                if receipt.vision_analyses
                else ""
            )

            worksheet.append([
                receipt.id,
                receipt.merchant_name or "",
                receipt.merchant_category or "",
                receipt.invoice_number or "",
                receipt.receipt_date or "",
                receipt.receipt_time or "",
                len(receipt.items),
                receipt.subtotal,
                receipt.tax,
                receipt.tax_rate,
                receipt.discount,
                receipt.total,
                receipt.currency or "",
                receipt.payment_method or "",
                vision_status,
            ])

        column_widths = {
            "A": 12,
            "B": 24,
            "C": 20,
            "D": 20,
            "E": 16,
            "F": 12,
            "G": 10,
            "H": 14,
            "I": 14,
            "J": 12,
            "K": 14,
            "L": 14,
            "M": 12,
            "N": 18,
            "O": 16,
        }

        for column, width in (
            column_widths.items()
        ):

            worksheet.column_dimensions[
                column
            ].width = width

        worksheet.freeze_panes = "A2"

        worksheet.auto_filter.ref = (
            worksheet.dimensions
        )

        output = BytesIO()

        workbook.save(output)

        output.seek(0)

        filename = (
            "smartreceiptai-receipts.xlsx"
        )

        return StreamingResponse(
            output,
            media_type=(
                "application/vnd.openxmlformats-"
                "officedocument.spreadsheetml.sheet"
            ),
            headers={
                "Content-Disposition":
                    (
                        f'attachment; '
                        f'filename="{filename}"'
                    ),
            },
        )

    except HTTPException:
        raise

    except Exception as exc:

        logger.exception(
            "Failed to export receipts to Excel."
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to export receipts "
                "to Excel."
            ),
        ) from exc

    finally:
        db.close()


# =========================================================
# Get Single Receipt
# =========================================================

@router.get(
    "/{receipt_id}"
)
async def get_receipt(
    receipt_id: int,
    current_user: UserModel = Depends(
        get_current_user
    ),
):
    db = SessionLocal()

    try:

        repository = ReceiptRepository(db)

        receipt = repository.get_receipt_by_user(
            receipt_id=receipt_id,
            user_id=current_user.id,
        )

        if not receipt:
            raise HTTPException(
                status_code=404,
                detail="Receipt not found.",
            )

        return {
            "success": True,

            "receipt": {
                "id": receipt.id,

                # Image
                "image_url": (
                    f"/api/v1/receipt/"
                    f"{receipt.id}/image"
                    if receipt.images
                    else None
                ),

                # Merchant
                "merchant_name": (
                    receipt.merchant_name
                ),
                "merchant_category": (
                    receipt.merchant_category
                ),
                "merchant_address": (
                    receipt.merchant_address
                ),
                "merchant_phone": (
                    receipt.merchant_phone
                ),

                # Receipt
                "invoice_number": (
                    receipt.invoice_number
                ),
                "receipt_date": (
                    receipt.receipt_date
                ),
                "receipt_time": (
                    receipt.receipt_time
                ),

                # Financial
                "currency": receipt.currency,
                "subtotal": receipt.subtotal,
                "tax": receipt.tax,
                "tax_rate": receipt.tax_rate,
                "discount": receipt.discount,
                "total": receipt.total,

                # Payment
                "payment_method": (
                    receipt.payment_method
                ),

                # Vision
                "vision_status": (
                    receipt.vision_analyses[-1].status
                    if receipt.vision_analyses
                    else None
                ),

                # Metadata
                "created_at": (
                    receipt.created_at.isoformat()
                    if receipt.created_at
                    else None
                ),
                "updated_at": (
                    receipt.updated_at.isoformat()
                    if receipt.updated_at
                    else None
                ),

                # Items
                "items": [
                    {
                        "id": item.id,
                        "name": item.name,
                        "quantity": item.quantity,
                        "unit_price": item.unit_price,
                        "total_price": item.total_price,
                    }
                    for item in receipt.items
                ],
            },
        }

    except HTTPException:
        raise

    except Exception as exc:

        logger.exception(
            "Failed to retrieve receipt %s",
            receipt_id,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve receipt.",
        ) from exc

    finally:
        db.close()


# =========================================================
# Get Receipt Image
# =========================================================

@router.get(
    "/{receipt_id}/image"
)
async def get_receipt_image(
    receipt_id: int,
    current_user: UserModel = Depends(
        get_current_user
    ),
):
    db = SessionLocal()

    try:

        repository = ReceiptRepository(db)

        receipt = repository.get_receipt_by_user(
            receipt_id=receipt_id,
            user_id=current_user.id,
        )

        if not receipt:
            raise HTTPException(
                status_code=404,
                detail="Receipt not found.",
            )

        if not receipt.images:
            raise HTTPException(
                status_code=404,
                detail="Receipt image not found.",
            )

        image = receipt.images[0]

        image_path = Path(
            image.file_path
        )

        if not image_path.exists():
            raise HTTPException(
                status_code=404,
                detail=(
                    "Receipt image file not found."
                ),
            )

        return FileResponse(
            path=image_path,
            media_type=(
                image.mime_type
                or "application/octet-stream"
            ),
            filename=image.file_name,
        )

    except HTTPException:
        raise

    except Exception as exc:

        logger.exception(
            "Failed to retrieve image "
            "for receipt %s",
            receipt_id,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to retrieve receipt image."
            ),
        ) from exc

    finally:
        db.close()


# =========================================================
# Update Receipt
# =========================================================

@router.put(
    "/{receipt_id}"
)
async def update_receipt(
    receipt_id: int,
    data: dict,
    current_user: UserModel = Depends(
        get_current_user
    ),
):
    db = SessionLocal()

    try:

        repository = ReceiptRepository(db)

        receipt = repository.get_receipt_by_user(
            receipt_id=receipt_id,
            user_id=current_user.id,
        )

        if not receipt:
            raise HTTPException(
                status_code=404,
                detail="Receipt not found.",
            )

        updated = repository.update_receipt(
            receipt_model=receipt,
            data=data,
        )

        return {
            "success": True,
            "message": (
                "Receipt updated successfully."
            ),

            "receipt": {
                "id": updated.id,

                # Merchant
                "merchant_name": (
                    updated.merchant_name
                ),
                "merchant_category": (
                    updated.merchant_category
                ),
                "merchant_address": (
                    updated.merchant_address
                ),
                "merchant_phone": (
                    updated.merchant_phone
                ),

                # Receipt
                "invoice_number": (
                    updated.invoice_number
                ),
                "receipt_date": (
                    updated.receipt_date
                ),
                "receipt_time": (
                    updated.receipt_time
                ),

                # Financial
                "currency": updated.currency,
                "subtotal": updated.subtotal,
                "tax": updated.tax,
                "tax_rate": updated.tax_rate,
                "discount": updated.discount,
                "total": updated.total,

                # Payment
                "payment_method": (
                    updated.payment_method
                ),

                # Image
                "image_url": (
                    f"/api/v1/receipt/"
                    f"{updated.id}/image"
                    if updated.images
                    else None
                ),

                # Metadata
                "created_at": (
                    updated.created_at.isoformat()
                    if updated.created_at
                    else None
                ),
                "updated_at": (
                    updated.updated_at.isoformat()
                    if updated.updated_at
                    else None
                ),

                # Items
                "items_count": len(
                    updated.items
                ),
            },
        }

    except HTTPException:
        raise

    except Exception as exc:

        db.rollback()

        logger.exception(
            "Failed to update receipt %s",
            receipt_id,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to update receipt.",
        ) from exc

    finally:
        db.close()


# =========================================================
# Delete Receipt
# =========================================================

@router.delete(
    "/{receipt_id}"
)
async def delete_receipt(
    receipt_id: int,
    current_user: UserModel = Depends(
        get_current_user
    ),
):
    db = SessionLocal()

    try:

        repository = ReceiptRepository(db)

        receipt = repository.get_receipt_by_user(
            receipt_id=receipt_id,
            user_id=current_user.id,
        )

        if not receipt:
            raise HTTPException(
                status_code=404,
                detail="Receipt not found.",
            )

        repository.delete_receipt(
            receipt
        )

        return {
            "success": True,
            "message": (
                "Receipt deleted successfully."
            ),
            "receipt_id": receipt_id,
        }

    except HTTPException:
        raise

    except Exception as exc:

        db.rollback()

        logger.exception(
            "Failed to delete receipt %s",
            receipt_id,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to delete receipt.",
        ) from exc

    finally:
        db.close()