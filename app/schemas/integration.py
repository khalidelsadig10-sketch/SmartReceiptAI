from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class IntegrationSettingBase(BaseModel):
    system_name: str
    organization_name: str


class IntegrationSettingCreate(IntegrationSettingBase):
    pass


class IntegrationSettingResponse(IntegrationSettingBase):
    id: int
    api_key: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DigitalReceiptItem(BaseModel):
    name: str
    quantity: float
    price: float


class DigitalReceiptPayload(BaseModel):
    receipt_number: str
    customer_name: Optional[str] = None
    items: List[DigitalReceiptItem]
    currency: str
    total: float
    subtotal: Optional[float] = None
    tax: Optional[float] = None
    discount: Optional[float] = None
    receipt_date: Optional[str] = None
    receipt_time: Optional[str] = None
    payment_method: Optional[str] = None
