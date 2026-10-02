from typing import Optional

from pydantic import BaseModel, Field


class Merchant(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None


class ReceiptInfo(BaseModel):
    invoice_number: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    currency: Optional[str] = None


class ReceiptItem(BaseModel):
    name: str
    quantity: Optional[float] = None
    unit_price: Optional[float] = None
    total_price: Optional[float] = None


class Financial(BaseModel):
    subtotal: Optional[float] = None
    tax: Optional[float] = None
    tax_rate: Optional[float] = None
    discount: Optional[float] = None
    total: Optional[float] = None


class Payment(BaseModel):
    method: Optional[str] = None


class Receipt(BaseModel):
    merchant: Merchant = Field(default_factory=Merchant)
    receipt_info: ReceiptInfo = Field(default_factory=ReceiptInfo)
    items: list[ReceiptItem] = Field(default_factory=list)
    financial: Financial = Field(default_factory=Financial)
    payment: Payment = Field(default_factory=Payment)

    qr_detected: bool = False
    qr_type: Optional[str] = None
    qr_data: Optional[str] = None


class ValidationResponse(BaseModel):
    is_valid: bool
    warnings: list[str] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)


class DatabaseResponse(BaseModel):
    saved: bool
    receipt_id: Optional[int] = None


class ReceiptProcessResponse(BaseModel):
    success: bool
    receipt: Receipt
    validation: ValidationResponse
    database: DatabaseResponse


class BatchReceiptItem(BaseModel):
    filename: str
    success: bool
    receipt: Optional[Receipt] = None
    validation: Optional[ValidationResponse] = None
    database: Optional[DatabaseResponse] = None
    error: Optional[str] = None


class BatchReceiptProcessResponse(BaseModel):
    success: bool
    total_files: int
    processed: int
    failed: int
    results: list[BatchReceiptItem] = Field(default_factory=list)