from pydantic import BaseModel, Field


# =========================================================
# Overview
# =========================================================

class AnalyticsOverview(BaseModel):
    total_receipts: int = 0
    total_items: int = 0


class AnalyticsCurrencySummary(BaseModel):
    currency: str
    receipt_count: int = 0
    total_amount: float = 0.0
    average_receipt: float = 0.0
    subtotal: float = 0.0
    total_tax: float = 0.0
    total_discount: float = 0.0


# =========================================================
# Processing Trend
# =========================================================

class AnalyticsProcessingTrend(BaseModel):
    date: str
    receipts: int = 0
    items: int = 0


# =========================================================
# Payment Methods
# =========================================================

class AnalyticsPaymentMethod(BaseModel):
    method: str
    count: int = 0


# =========================================================
# Merchant Categories
# =========================================================

class AnalyticsMerchantCategory(BaseModel):
    category: str
    count: int = 0


# =========================================================
# Vision Analysis
# =========================================================

class AnalyticsVision(BaseModel):
    successful: int = 0
    failed: int = 0
    success_rate: float = 0.0


# =========================================================
# Response
# =========================================================

class AnalyticsData(BaseModel):
    overview: AnalyticsOverview
    currencies: list[AnalyticsCurrencySummary] = Field(
        default_factory=list
    )
    processing_trend: list[AnalyticsProcessingTrend] = Field(
        default_factory=list
    )
    payment_methods: list[AnalyticsPaymentMethod] = Field(
        default_factory=list
    )
    merchant_categories: list[AnalyticsMerchantCategory] = Field(
        default_factory=list
    )
    vision: AnalyticsVision


class AnalyticsResponse(BaseModel):
    success: bool
    data: AnalyticsData