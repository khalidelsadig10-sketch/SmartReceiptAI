from collections import Counter, defaultdict
from datetime import date, datetime, time, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.receipt import ReceiptModel
from app.schemas.reports import (
    ReportCurrencySummary,
    ReportData,
    ReportMerchantCategory,
    ReportOverview,
    ReportPaymentMethod,
    ReportProcessingTrend,
    ReportQR,
    ReportReceipt,
    ReportReceiptItem,
    ReportVision,
)


class ReportsService:

    @staticmethod
    def get_report(
        db: Session,
        user_id: int,
        start_date: date,
        end_date: date,
    ) -> ReportData:

        if end_date < start_date:
            raise ValueError(
                "End date cannot be earlier than start date."
            )

        start_datetime = datetime.combine(
            start_date,
            time.min,
        )

        end_datetime = datetime.combine(
            end_date + timedelta(days=1),
            time.min,
        )

        receipts = (
            db.execute(
                select(ReceiptModel)
                .where(
                    ReceiptModel.user_id == user_id,
                    ReceiptModel.created_at >= start_datetime,
                    ReceiptModel.created_at < end_datetime,
                )
                .order_by(
                    ReceiptModel.created_at.asc()
                )
            )
            .scalars()
            .all()
        )

        total_receipts = len(receipts)

        total_items = sum(
            len(receipt.items)
            for receipt in receipts
        )

        currencies = defaultdict(
            lambda: {
                "receipt_count": 0,
                "total_amount": 0.0,
                "subtotal": 0.0,
                "total_tax": 0.0,
                "total_discount": 0.0,
            }
        )

        payment_methods = Counter()
        merchant_categories = Counter()
        processing_trend = defaultdict(
            lambda: {
                "receipts": 0,
                "items": 0,
            }
        )

        successful = 0
        failed = 0

        qr_detected = 0
        without_qr = 0

        report_receipts = []

        for receipt in receipts:

            currency = (
                receipt.currency
                or "Unknown"
            )

            currency_data = currencies[currency]

            currency_data["receipt_count"] += 1
            currency_data["total_amount"] += (
                float(receipt.total or 0.0)
            )
            currency_data["subtotal"] += (
                float(receipt.subtotal or 0.0)
            )
            currency_data["total_tax"] += (
                float(receipt.tax or 0.0)
            )
            currency_data["total_discount"] += (
                float(receipt.discount or 0.0)
            )

            payment_methods[
                receipt.payment_method
                or "Unknown"
            ] += 1

            merchant_categories[
                receipt.merchant_category
                or "Unknown"
            ] += 1

            receipt_date = (
                receipt.created_at.date()
                if receipt.created_at
                else None
            )

            if receipt_date is not None:

                date_key = receipt_date.isoformat()

                processing_trend[
                    date_key
                ]["receipts"] += 1

                processing_trend[
                    date_key
                ]["items"] += len(
                    receipt.items
                )

            latest_vision = (
                receipt.vision_analyses[-1]
                if receipt.vision_analyses
                else None
            )

            if latest_vision:

                status = (
                    latest_vision.status
                    or ""
                ).lower()

                if status in {
                    "success",
                    "successful",
                    "completed",
                }:
                    successful += 1

                elif status in {
                    "failed",
                    "error",
                }:
                    failed += 1

            if receipt.qr_detected:
                qr_detected += 1
            else:
                without_qr += 1

            report_receipts.append(
                ReportReceipt(
                    id=receipt.id,
                    merchant_name=(
                        receipt.merchant_name
                    ),
                    merchant_category=(
                        receipt.merchant_category
                    ),
                    invoice_number=(
                        receipt.invoice_number
                    ),
                    receipt_date=(
                        receipt.receipt_date
                    ),
                    receipt_time=(
                        receipt.receipt_time
                    ),
                    currency=(
                        receipt.currency
                    ),
                    subtotal=(
                        receipt.subtotal
                    ),
                    tax=(
                        receipt.tax
                    ),
                    tax_rate=(
                        receipt.tax_rate
                    ),
                    discount=(
                        receipt.discount
                    ),
                    total=(
                        receipt.total
                    ),
                    payment_method=(
                        receipt.payment_method
                    ),
                    qr_detected=(
                        bool(receipt.qr_detected)
                    ),
                    qr_type=(
                        receipt.qr_type
                    ),
                    qr_data=(
                        receipt.qr_data
                    ),
                    items=[
                        ReportReceiptItem(
                            name=item.name,
                            quantity=item.quantity,
                            unit_price=item.unit_price,
                            total_price=item.total_price,
                        )
                        for item in receipt.items
                    ],
                    created_at=(
                        receipt.created_at.isoformat()
                        if receipt.created_at
                        else None
                    ),
                )
            )

        currency_results = []

        for currency, data in sorted(
            currencies.items()
        ):

            receipt_count = (
                data["receipt_count"]
            )

            average_receipt = (
                data["total_amount"]
                / receipt_count
                if receipt_count > 0
                else 0.0
            )

            currency_results.append(
                ReportCurrencySummary(
                    currency=currency,
                    receipt_count=receipt_count,
                    total_amount=round(
                        data["total_amount"],
                        2,
                    ),
                    average_receipt=round(
                        average_receipt,
                        2,
                    ),
                    subtotal=round(
                        data["subtotal"],
                        2,
                    ),
                    total_tax=round(
                        data["total_tax"],
                        2,
                    ),
                    total_discount=round(
                        data["total_discount"],
                        2,
                    ),
                )
            )

        processing_results = [
            ReportProcessingTrend(
                date=trend_date,
                receipts=data["receipts"],
                items=data["items"],
            )
            for trend_date, data in sorted(
                processing_trend.items()
            )
        ]

        payment_results = [
            ReportPaymentMethod(
                method=method,
                count=count,
            )
            for method, count in payment_methods.most_common()
        ]

        category_results = [
            ReportMerchantCategory(
                category=category,
                count=count,
            )
            for category, count in merchant_categories.most_common()
        ]

        total_vision = (
            successful + failed
        )

        success_rate = (
            (successful / total_vision) * 100
            if total_vision > 0
            else 0.0
        )

        overview_total = 0.0

        if len(currency_results) == 1:

            overview_total = (
                currency_results[0].total_amount
            )

        average_receipt = (
            overview_total / total_receipts
            if total_receipts > 0
            and len(currency_results) == 1
            else 0.0
        )

        return ReportData(
            start_date=start_date.isoformat(),
            end_date=end_date.isoformat(),
            generated_at=datetime.utcnow().isoformat(),

            overview=ReportOverview(
                total_receipts=total_receipts,
                total_items=total_items,
                total_amount=round(
                    overview_total,
                    2,
                ),
                average_receipt=round(
                    average_receipt,
                    2,
                ),
            ),

            currencies=currency_results,

            processing_trend=processing_results,

            payment_methods=payment_results,

            merchant_categories=category_results,

            vision=ReportVision(
                successful=successful,
                failed=failed,
                success_rate=round(
                    success_rate,
                    2,
                ),
            ),

            qr=ReportQR(
                detected_receipts=qr_detected,
                without_qr=without_qr,
            ),

            receipts=report_receipts,
        )