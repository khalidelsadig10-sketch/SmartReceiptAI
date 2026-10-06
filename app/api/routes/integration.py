import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.core.database import SessionLocal
from app.models.integration import IntegrationSettingModel
from app.models.receipt import ReceiptModel
from app.models.receipt_item import ReceiptItemModel
from app.models.user import UserModel
from app.schemas.integration import (
    IntegrationSettingCreate,
    IntegrationSettingResponse,
    DigitalReceiptPayload,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1/integrations",
    tags=["Integration"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=List[IntegrationSettingResponse])
def get_integrations(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    integrations = db.query(IntegrationSettingModel).all()
    return integrations


@router.post("", response_model=IntegrationSettingResponse)
def create_integration(
    payload: IntegrationSettingCreate,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_integration = IntegrationSettingModel(
        system_name=payload.system_name,
        organization_name=payload.organization_name,
    )
    db.add(new_integration)
    db.commit()
    db.refresh(new_integration)
    return new_integration


async def verify_api_key(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
) -> IntegrationSettingModel:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing Authorization header. Format should be 'Bearer <API_KEY>'",
        )

    api_key = authorization.split("Bearer ")[1]

    integration = (
        db.query(IntegrationSettingModel)
        .filter(IntegrationSettingModel.api_key == api_key)
        .first()
    )

    if not integration:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
        )

    return integration


@router.post("/digital-receipt")
def receive_digital_receipt(
    payload: DigitalReceiptPayload,
    integration: IntegrationSettingModel = Depends(verify_api_key),
    db: Session = Depends(get_db),
):
    # Idempotency check
    existing_receipt = (
        db.query(ReceiptModel)
        .filter(
            ReceiptModel.integration_id == integration.id,
            ReceiptModel.invoice_number == payload.receipt_number,
        )
        .first()
    )

    if existing_receipt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Receipt {payload.receipt_number} already processed.",
        )

    # Find the user khalid for the demo to assign this receipt to
    latest_user = db.query(UserModel).filter(UserModel.email.ilike("%khalid%")).first()
    if not latest_user:
        latest_user = db.query(UserModel).order_by(UserModel.id.desc()).first()
    target_user_id = latest_user.id if latest_user else 1

    receipt = ReceiptModel(
        user_id=target_user_id, 
        merchant_name=integration.organization_name,
        merchant_category=f"Patient: {payload.customer_name}" if payload.customer_name else "Hospital Services",
        invoice_number=payload.receipt_number,
        currency=payload.currency,
        total=payload.total,
        subtotal=payload.subtotal,
        tax=payload.tax,
        discount=payload.discount,
        receipt_date=payload.receipt_date,
        receipt_time=payload.receipt_time,
        payment_method=payload.payment_method,
        source="digital",
        integration_id=integration.id,
    )

    db.add(receipt)
    db.commit()
    db.refresh(receipt)

    for item_data in payload.items:
        item = ReceiptItemModel(
            receipt_id=receipt.id,
            name=item_data.name,
            quantity=item_data.quantity,
            unit_price=item_data.price,
            total_price=item_data.quantity * item_data.price,
        )
        db.add(item)

    db.commit()

    return {
        "status": "success",
        "receipt_id": receipt.id,
        "message": "Digital receipt processed successfully",
    }
