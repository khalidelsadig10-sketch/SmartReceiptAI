from datetime import datetime

from pydantic import BaseModel, Field


# =========================================================
# Statistics
# =========================================================

class DashboardStatsData(BaseModel):
    total_receipts: int
    total_items: int
    total_amount: float
    average_receipt: float
    total_tax: float
    total_discount: float
    successful_vision_analyses: int
    failed_vision_analyses: int


class DashboardStatsResponse(BaseModel):
    success: bool
    data: DashboardStatsData


# =========================================================
# Recent Receipts
# =========================================================

class DashboardRecentReceipt(BaseModel):
    id: int
    merchant_name: str | None = None
    invoice_number: str | None = None
    receipt_date: str | None = None
    currency: str | None = None
    total: float | None = None
    payment_method: str | None = None
    created_at: datetime


class DashboardRecentResponse(BaseModel):
    success: bool
    total: int
    receipts: list[DashboardRecentReceipt]


# =========================================================
# Receipt Details
# =========================================================

class DashboardReceiptItem(BaseModel):
    id: int
    name: str
    quantity: float | None = None
    unit_price: float | None = None
    total_price: float | None = None


class DashboardReceiptImage(BaseModel):
    id: int
    file_name: str
    file_path: str
    mime_type: str | None = None
    created_at: datetime


class DashboardVisionAnalysis(BaseModel):
    id: int
    model_name: str
    status: str
    raw_response: str | None = None
    error_message: str | None = None
    created_at: datetime


class DashboardReceiptDetails(BaseModel):
    id: int

    # Merchant
    merchant_name: str | None = None
    merchant_category: str | None = None
    merchant_address: str | None = None
    merchant_phone: str | None = None

    # Receipt information
    invoice_number: str | None = None
    receipt_date: str | None = None
    receipt_time: str | None = None
    currency: str | None = None

    # Financial
    subtotal: float | None = None
    tax: float | None = None
    tax_rate: float | None = None
    discount: float | None = None
    total: float | None = None

    # Payment
    payment_method: str | None = None

    # Metadata
    created_at: datetime
    updated_at: datetime

    # Relations
    items: list[DashboardReceiptItem] = Field(default_factory=list)
    images: list[DashboardReceiptImage] = Field(default_factory=list)
    vision_analyses: list[DashboardVisionAnalysis] = Field(
        default_factory=list
    )


class DashboardReceiptDetailsResponse(BaseModel):
    success: bool
    data: DashboardReceiptDetails