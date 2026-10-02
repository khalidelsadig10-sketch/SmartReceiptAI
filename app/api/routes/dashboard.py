from collections.abc import Generator

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.core.database import SessionLocal
from app.models.user import UserModel
from app.schemas.dashboard import (
    DashboardRecentReceipt,
    DashboardRecentResponse,
    DashboardReceiptDetails,
    DashboardReceiptDetailsResponse,
    DashboardReceiptImage,
    DashboardReceiptItem,
    DashboardStatsResponse,
    DashboardVisionAnalysis,
)
from app.services.dashboard_service import DashboardService


router = APIRouter(
    prefix="/api/v1/dashboard",
    tags=["Dashboard"],
)


# =========================================================
# Database Dependency
# =========================================================

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================================================
# Statistics
# =========================================================

@router.get(
    "/stats",
    response_model=DashboardStatsResponse,
)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(
        get_current_user
    ),
):
    stats = DashboardService.get_stats(
        db=db,
        user_id=current_user.id,
    )

    return {
        "success": True,
        "data": stats,
    }


# =========================================================
# Recent Receipts
# =========================================================

@router.get(
    "/recent",
    response_model=DashboardRecentResponse,
)
def get_recent_receipts(
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
    ),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(
        get_current_user
    ),
):
    receipts = DashboardService.get_recent_receipts(
        db=db,
        user_id=current_user.id,
        limit=limit,
    )

    data = [
        DashboardRecentReceipt(
            id=receipt.id,
            merchant_name=receipt.merchant_name,
            invoice_number=receipt.invoice_number,
            receipt_date=receipt.receipt_date,
            currency=receipt.currency,
            total=receipt.total,
            payment_method=receipt.payment_method,
            created_at=receipt.created_at,
        )
        for receipt in receipts
    ]

    return {
        "success": True,
        "total": len(data),
        "receipts": data,
    }


# =========================================================
# Receipt Details
# =========================================================

@router.get(
    "/receipts/{receipt_id}",
    response_model=DashboardReceiptDetailsResponse,
)
def get_receipt_details(
    receipt_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(
        get_current_user
    ),
):
    receipt = DashboardService.get_receipt_details(
        db=db,
        receipt_id=receipt_id,
        user_id=current_user.id,
    )

    if receipt is None:
        raise HTTPException(
            status_code=404,
            detail="Receipt not found.",
        )

    data = DashboardReceiptDetails(
        id=receipt.id,

        # Merchant
        merchant_name=receipt.merchant_name,
        merchant_category=receipt.merchant_category,
        merchant_address=receipt.merchant_address,
        merchant_phone=receipt.merchant_phone,

        # Receipt information
        invoice_number=receipt.invoice_number,
        receipt_date=receipt.receipt_date,
        receipt_time=receipt.receipt_time,
        currency=receipt.currency,

        # Financial
        subtotal=receipt.subtotal,
        tax=receipt.tax,
        tax_rate=receipt.tax_rate,
        discount=receipt.discount,
        total=receipt.total,

        # Payment
        payment_method=receipt.payment_method,

        # Metadata
        created_at=receipt.created_at,
        updated_at=receipt.updated_at,

        # Items
        items=[
            DashboardReceiptItem(
                id=item.id,
                name=item.name,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total_price=item.total_price,
            )
            for item in receipt.items
        ],

        # Images
        images=[
            DashboardReceiptImage(
                id=image.id,
                file_name=image.file_name,
                file_path=image.file_path,
                mime_type=image.mime_type,
                created_at=image.created_at,
            )
            for image in receipt.images
        ],

        # Vision
        vision_analyses=[
            DashboardVisionAnalysis(
                id=analysis.id,
                model_name=analysis.model_name,
                status=analysis.status,
                raw_response=analysis.raw_response,
                error_message=analysis.error_message,
                created_at=analysis.created_at,
            )
            for analysis in receipt.vision_analyses
        ],
    )

    return {
        "success": True,
        "data": data,
    }