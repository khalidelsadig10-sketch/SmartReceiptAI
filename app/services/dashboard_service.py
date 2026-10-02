from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.models.receipt import ReceiptModel
from app.models.receipt_item import ReceiptItemModel
from app.models.vision_analysis import VisionAnalysisModel


class DashboardService:
    """Database-driven service for user-specific dashboard operations."""

    # =====================================================
    # Statistics
    # =====================================================

    @staticmethod
    def get_stats(
        db: Session,
        user_id: int,
    ) -> dict:

        total_receipts = db.scalar(
            select(func.count(ReceiptModel.id))
            .where(
                ReceiptModel.user_id == user_id
            )
        ) or 0

        total_items = db.scalar(
            select(func.count(ReceiptItemModel.id))
            .join(
                ReceiptModel,
                ReceiptItemModel.receipt_id
                == ReceiptModel.id,
            )
            .where(
                ReceiptModel.user_id == user_id
            )
        ) or 0

        total_amount = db.scalar(
            select(
                func.coalesce(
                    func.sum(ReceiptModel.total),
                    0.0,
                )
            )
            .where(
                ReceiptModel.user_id == user_id
            )
        ) or 0.0

        average_receipt = db.scalar(
            select(
                func.coalesce(
                    func.avg(ReceiptModel.total),
                    0.0,
                )
            )
            .where(
                ReceiptModel.user_id == user_id
            )
        ) or 0.0

        total_tax = db.scalar(
            select(
                func.coalesce(
                    func.sum(ReceiptModel.tax),
                    0.0,
                )
            )
            .where(
                ReceiptModel.user_id == user_id
            )
        ) or 0.0

        total_discount = db.scalar(
            select(
                func.coalesce(
                    func.sum(ReceiptModel.discount),
                    0.0,
                )
            )
            .where(
                ReceiptModel.user_id == user_id
            )
        ) or 0.0

        successful_vision_analyses = db.scalar(
            select(
                func.count(
                    VisionAnalysisModel.id
                )
            )
            .join(
                ReceiptModel,
                VisionAnalysisModel.receipt_id
                == ReceiptModel.id,
            )
            .where(
                ReceiptModel.user_id == user_id,
                VisionAnalysisModel.status.in_(
                    [
                        "success",
                        "successful",
                        "completed",
                    ]
                ),
            )
        ) or 0

        failed_vision_analyses = db.scalar(
            select(
                func.count(
                    VisionAnalysisModel.id
                )
            )
            .join(
                ReceiptModel,
                VisionAnalysisModel.receipt_id
                == ReceiptModel.id,
            )
            .where(
                ReceiptModel.user_id == user_id,
                VisionAnalysisModel.status.in_(
                    [
                        "failed",
                        "error",
                    ]
                ),
            )
        ) or 0

        return {
            "total_receipts": int(
                total_receipts
            ),
            "total_items": int(
                total_items
            ),
            "total_amount": float(
                total_amount
            ),
            "average_receipt": float(
                average_receipt
            ),
            "total_tax": float(
                total_tax
            ),
            "total_discount": float(
                total_discount
            ),
            "successful_vision_analyses": int(
                successful_vision_analyses
            ),
            "failed_vision_analyses": int(
                failed_vision_analyses
            ),
        }

    # =====================================================
    # Recent Receipts
    # =====================================================

    @staticmethod
    def get_recent_receipts(
        db: Session,
        user_id: int,
        limit: int = 10,
    ) -> list[ReceiptModel]:

        statement = (
            select(ReceiptModel)
            .where(
                ReceiptModel.user_id == user_id
            )
            .order_by(
                ReceiptModel.created_at.desc()
            )
            .limit(limit)
        )

        return list(
            db.scalars(statement).all()
        )

    # =====================================================
    # Receipt Details
    # =====================================================

    @staticmethod
    def get_receipt_details(
        db: Session,
        receipt_id: int,
        user_id: int,
    ) -> ReceiptModel | None:

        statement = (
            select(ReceiptModel)
            .options(
                selectinload(
                    ReceiptModel.items
                ),
                selectinload(
                    ReceiptModel.images
                ),
                selectinload(
                    ReceiptModel.vision_analyses
                ),
            )
            .where(
                ReceiptModel.id == receipt_id,
                ReceiptModel.user_id == user_id,
            )
        )

        return db.scalar(statement)