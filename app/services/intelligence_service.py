from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.receipt import ReceiptModel
from app.models.vision_analysis import VisionAnalysisModel


class IntelligenceService:
    """Database-driven AI intelligence information."""

    # =====================================================
    # Overview
    # =====================================================

    @staticmethod
    def get_overview(
        db: Session,
        user_id: int,
    ) -> dict:

        total = (
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
                    ReceiptModel.user_id == user_id
                )
            )
            or 0
        )

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

        total = int(total)
        successful = int(successful)
        failed = int(failed)

        success_rate = (
            (successful / total) * 100
            if total > 0
            else 0.0
        )

        return {
            "total_analyses": total,
            "successful_analyses": successful,
            "failed_analyses": failed,
            "success_rate": round(
                success_rate,
                2,
            ),
        }

    # =====================================================
    # Vision Models
    # =====================================================

    @staticmethod
    def get_vision_models(
        db: Session,
        user_id: int,
    ) -> list[dict]:

        statement = (
            select(
                VisionAnalysisModel.model_name,
                func.count(
                    VisionAnalysisModel.id
                ).label("analyses"),
            )
            .join(
                ReceiptModel,
                VisionAnalysisModel.receipt_id
                == ReceiptModel.id,
            )
            .where(
                ReceiptModel.user_id == user_id
            )
            .group_by(
                VisionAnalysisModel.model_name
            )
            .order_by(
                func.count(
                    VisionAnalysisModel.id
                ).desc()
            )
        )

        rows = db.execute(
            statement
        ).all()

        result = []

        for row in rows:

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
                        VisionAnalysisModel.model_name
                        == row.model_name,
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
                        VisionAnalysisModel.model_name
                        == row.model_name,
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

            result.append(
                {
                    "model_name": str(
                        row.model_name
                    ),
                    "analyses": int(
                        row.analyses or 0
                    ),
                    "successful": int(
                        successful
                    ),
                    "failed": int(
                        failed
                    ),
                }
            )

        return result

    # =====================================================
    # Recent Vision Analyses
    # =====================================================

    @staticmethod
    def get_recent_analyses(
        db: Session,
        user_id: int,
        limit: int = 10,
    ) -> list[dict]:

        statement = (
            select(
                VisionAnalysisModel,
                ReceiptModel.merchant_name,
            )
            .join(
                ReceiptModel,
                VisionAnalysisModel.receipt_id
                == ReceiptModel.id,
            )
            .where(
                ReceiptModel.user_id == user_id
            )
            .order_by(
                VisionAnalysisModel.created_at.desc()
            )
            .limit(limit)
        )

        rows = db.execute(
            statement
        ).all()

        return [
            {
                "id": analysis.id,
                "receipt_id": analysis.receipt_id,
                "merchant_name": merchant_name,
                "model_name": analysis.model_name,
                "status": analysis.status,
                "created_at": analysis.created_at,
            }
            for analysis, merchant_name in rows
        ]

    # =====================================================
    # Processing Pipeline
    # =====================================================

    @staticmethod
    def get_pipeline() -> list[dict]:

        return [
            {
                "key": "vision",
                "title": "OpenAI Vision",
                "description": (
                    "Analyzes the receipt image and "
                    "extracts structured receipt data."
                ),
                "status": "active",
            },
            {
                "key": "currency_normalization",
                "title": "Currency Normalization",
                "description": (
                    "Normalizes and standardizes "
                    "currency information."
                ),
                "status": "active",
            },
            {
                "key": "product_normalization",
                "title": "Product Normalization",
                "description": (
                    "Cleans and normalizes product "
                    "information."
                ),
                "status": "active",
            },
            {
                "key": "financial_recovery",
                "title": "Financial Recovery",
                "description": (
                    "Recovers and normalizes financial "
                    "information from the receipt."
                ),
                "status": "active",
            },
            {
                "key": "validation",
                "title": "Receipt Validation",
                "description": (
                    "Checks the processed receipt data "
                    "for consistency and validity."
                ),
                "status": "active",
            },
            {
                "key": "storage",
                "title": "Structured Storage",
                "description": (
                    "Stores the processed receipt, items, "
                    "image and vision analysis."
                ),
                "status": "active",
            },
        ]
    # =====================================================
    # Complete Intelligence
    # =====================================================

    @staticmethod
    def get_intelligence(
        db: Session,
        user_id: int,
        limit: int = 10,
    ) -> dict:

        return {
            "overview": (
                IntelligenceService.get_overview(
                    db=db,
                    user_id=user_id,
                )
            ),
            "vision_models": (
                IntelligenceService.get_vision_models(
                    db=db,
                    user_id=user_id,
                )
            ),
            "recent_analyses": (
                IntelligenceService.get_recent_analyses(
                    db=db,
                    user_id=user_id,
                    limit=limit,
                )
            ),
            "pipeline": (
                IntelligenceService.get_pipeline()
            ),
        }