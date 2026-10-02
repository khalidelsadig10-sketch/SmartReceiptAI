from typing import Optional

from pydantic import BaseModel, Field


class ReportOverview(BaseModel):
    total_receipts: int = 0
    total_items: int = 0
    total_amount: float = 0.0
    average_receipt: float = 0.0


class ReportCurrencySummary(BaseModel):
    currency: str
    receipt_count: int = 0
    total_amount: float = 0.0
    average_receipt: float = 0.0
    subtotal: float = 0.0
    total_tax: float = 0.0
    total_discount: float = 0.0


class ReportProcessingTrend(BaseModel):
    date: str
    receipts: int = 0
    items: int = 0


class ReportPaymentMethod(BaseModel):
    method: str
    count: int = 0


class ReportMerchantCategory(BaseModel):
    category: str
    count: int = 0


class ReportVision(BaseModel):
    successful: int = 0
    failed: int = 0
    success_rate: float = 0.0


class ReportQR(BaseModel):
    detected_receipts: int = 0
    without_qr: int = 0


class ReportReceiptItem(BaseModel):
    name: str
    quantity: Optional[float] = None
    unit_price: Optional[float] = None
    total_price: Optional[float] = None


class ReportReceipt(BaseModel):
    id: int
    merchant_name: Optional[str] = None
    merchant_category: Optional[str] = None
    invoice_number: Optional[str] = None
    receipt_date: Optional[str] = None
    receipt_time: Optional[str] = None
    currency: Optional[str] = None
    subtotal: Optional[float] = None
    tax: Optional[float] = None
    tax_rate: Optional[float] = None
    discount: Optional[float] = None
    total: Optional[float] = None
    payment_method: Optional[str] = None
    qr_detected: bool = False
    qr_type: Optional[str] = None
    qr_data: Optional[str] = None
    items: list[ReportReceiptItem] = Field(
        default_factory=list
    )
    created_at: Optional[str] = None


class ReportData(BaseModel):
    start_date: str
    end_date: str
    generated_at: str

    overview: ReportOverview

    currencies: list[ReportCurrencySummary] = Field(
        default_factory=list
    )

    processing_trend: list[ReportProcessingTrend] = Field(
        default_factory=list
    )

    payment_methods: list[ReportPaymentMethod] = Field(
        default_factory=list
    )

    merchant_categories: list[ReportMerchantCategory] = Field(
        default_factory=list
    )

    vision: ReportVision

    qr: ReportQR

    receipts: list[ReportReceipt] = Field(
        default_factory=list
    )


class ReportResponse(BaseModel):
    success: bool
    data: ReportData