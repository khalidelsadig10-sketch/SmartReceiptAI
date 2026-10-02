from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.receipt import ReceiptModel
from app.models.receipt_item import ReceiptItemModel
from app.models.vision_analysis import VisionAnalysisModel


class AnalyticsService:
    """Database-driven analytics for the authenticated user."""

    # =====================================================
    # Overview
    # =====================================================

    @staticmethod
    def get_overview(
        db: Session,
        user_id: int,
    ) -> dict:

        total_receipts = (
            db.scalar(
                select(
                    func.count(ReceiptModel.id)
                ).where(
                    ReceiptModel.user_id == user_id
                )
            )
            or 0
        )

        total_items = (
            db.scalar(
                select(
                    func.count(ReceiptItemModel.id)
                )
                .join(
                    ReceiptModel,
                    ReceiptItemModel.receipt_id
                    == ReceiptModel.id,
                )
                .where(
                    ReceiptModel.user_id == user_id
                )
            )
            or 0
        )

        return {
            "total_receipts": int(
                total_receipts
            ),
            "total_items": int(
                total_items
            ),
        }

    # =====================================================
    # Financial Data By Currency
    # =====================================================

    @staticmethod
    def get_currency_summaries(
        db: Session,
        user_id: int,
    ) -> list[dict]:

        statement = (
            select(
                ReceiptModel.currency,
                func.count(
                    ReceiptModel.id
                ).label("receipt_count"),
                func.coalesce(
                    func.sum(
                        ReceiptModel.total
                    ),
                    0.0,
                ).label("total_amount"),
                func.coalesce(
                    func.avg(
                        ReceiptModel.total
                    ),
                    0.0,
                ).label("average_receipt"),
                func.coalesce(
                    func.sum(
                        ReceiptModel.subtotal
                    ),
                    0.0,
                ).label("subtotal"),
                func.coalesce(
                    func.sum(
                        ReceiptModel.tax
                    ),
                    0.0,
                ).label("total_tax"),
                func.coalesce(
                    func.sum(
                        ReceiptModel.discount
                    ),
                    0.0,
                ).label("total_discount"),
            )
            .where(
                ReceiptModel.user_id == user_id
            )
            .group_by(
                ReceiptModel.currency
            )
            .order_by(
                func.count(
                    ReceiptModel.id
                ).desc()
            )
        )

        rows = db.execute(statement).all()

        result = []

        for row in rows:

            currency = (
                row.currency
                or "Unknown"
            )

            result.append(
                {
                    "currency": str(
                        currency
                    ),
                    "receipt_count": int(
                        row.receipt_count
                        or 0
                    ),
                    "total_amount": float(
                        row.total_amount
                        or 0.0
                    ),
                    "average_receipt": float(
                        row.average_receipt
                        or 0.0
                    ),
                    "subtotal": float(
                        row.subtotal
                        or 0.0
                    ),
                    "total_tax": float(
                        row.total_tax
                        or 0.0
                    ),
                    "total_discount": float(
                        row.total_discount
                        or 0.0
                    ),
                }
            )

        return result

    # =====================================================
    # Processing Trend
    # =====================================================

    @staticmethod
    def get_processing_trend(
        db: Session,
        user_id: int,
    ) -> list[dict]:

        receipt_rows = db.execute(
            select(
                func.date(
                    ReceiptModel.created_at
                ).label("date"),
                func.count(
                    ReceiptModel.id
                ).label("receipts"),
            )
            .where(
                ReceiptModel.user_id == user_id
            )
            .group_by(
                func.date(
                    ReceiptModel.created_at
                )
            )
            .order_by(
                func.date(
                    ReceiptModel.created_at
                )
            )
        ).all()

        item_rows = db.execute(
            select(
                func.date(
                    ReceiptModel.created_at
                ).label("date"),
                func.count(
                    ReceiptItemModel.id
                ).label("items"),
            )
            .join(
                ReceiptModel,
                ReceiptItemModel.receipt_id
                == ReceiptModel.id,
            )
            .where(
                ReceiptModel.user_id == user_id
            )
            .group_by(
                func.date(
                    ReceiptModel.created_at
                )
            )
            .order_by(
                func.date(
                    ReceiptModel.created_at
                )
            )
        ).all()

        item_map = {
            str(row.date): int(
                row.items or 0
            )
            for row in item_rows
        }

        return [
            {
                "date": str(
                    row.date
                ),
                "receipts": int(
                    row.receipts or 0
                ),
                "items": item_map.get(
                    str(row.date),
                    0,
                ),
            }
            for row in receipt_rows
        ]

    # =====================================================
    # Payment Methods
    # =====================================================

    @staticmethod
    def get_payment_methods(
        db: Session,
        user_id: int,
    ) -> list[dict]:

        statement = (
            select(
                ReceiptModel.payment_method,
                func.count(
                    ReceiptModel.id
                ).label("count"),
            )
            .where(
                ReceiptModel.user_id == user_id
            )
            .group_by(
                ReceiptModel.payment_method
            )
            .order_by(
                func.count(
                    ReceiptModel.id
                ).desc()
            )
        )

        rows = db.execute(
            statement
        ).all()

        return [
            {
                "method": str(
                    row.payment_method
                    or "Unknown"
                ),
                "count": int(
                    row.count or 0
                ),
            }
            for row in rows
        ]

    # =====================================================
    # Merchant Categories
    # =====================================================

    @staticmethod
    def get_merchant_categories(
        db: Session,
        user_id: int,
    ) -> list[dict]:

        statement = (
            select(
                ReceiptModel.merchant_category,
                func.count(
                    ReceiptModel.id
                ).label("count"),
            )
            .where(
                ReceiptModel.user_id == user_id
            )
            .group_by(
                ReceiptModel.merchant_category
            )
            .order_by(
                func.count(
                    ReceiptModel.id
                ).desc()
            )
        )

        rows = db.execute(
            statement
        ).all()

        return [
            {
                "category": str(
                    row.merchant_category
                    or "Unknown"
                ),
                "count": int(
                    row.count or 0
                ),
            }
            for row in rows
        ]

    # =====================================================
    # Vision Analysis
    # =====================================================

    @staticmethod
    def get_vision_stats(
        db: Session,
        user_id: int,
    ) -> dict:

        successful = (
            db.scalar(
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
            )
            or 0
        )

        failed = (
            db.scalar(
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
            )
            or 0
        )

        successful = int(successful)
        failed = int(failed)

        total = successful + failed

        success_rate = (
            (successful / total) * 100
            if total > 0
            else 0.0
        )

        return {
            "successful": successful,
            "failed": failed,
            "success_rate": round(
                success_rate,
                2,
            ),
        }

    # =====================================================
    # Complete Analytics
    # =====================================================

    @staticmethod
    def get_analytics(
        db: Session,
        user_id: int,
    ) -> dict:

        return {
            "overview": (
                AnalyticsService.get_overview(
                    db=db,
                    user_id=user_id,
                )
            ),
            "currencies": (
                AnalyticsService
                .get_currency_summaries(
                    db=db,
                    user_id=user_id,
                )
            ),
            "processing_trend": (
                AnalyticsService
                .get_processing_trend(
                    db=db,
                    user_id=user_id,
                )
            ),
            "payment_methods": (
                AnalyticsService
                .get_payment_methods(
                    db=db,
                    user_id=user_id,
                )
            ),
            "merchant_categories": (
                AnalyticsService
                .get_merchant_categories(
                    db=db,
                    user_id=user_id,
                )
            ),
            "vision": (
                AnalyticsService.get_vision_stats(
                    db=db,
                    user_id=user_id,
                )
            ),
        }