import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Header, Request, status
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user, require_admin
from app.core.database import SessionLocal
from app.core.security import decode_access_token
from app.models.integration import IntegrationSettingModel
from app.models.receipt import ReceiptModel
from app.models.receipt_item import ReceiptItemModel
from app.models.user import UserModel
from app.schemas.integration import (
    DigitalReceiptPayload,
    IntegrationSettingCreate,
    IntegrationSettingResponse,
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


def resolve_user_from_request(
    request: Request,
    db: Session,
) -> Optional[UserModel]:
    user_token = request.headers.get("X-User-Token") or request.headers.get(
        "X-Access-Token"
    )

    if not user_token:
        user_token = request.cookies.get("access_token")

    if user_token:
        if user_token.startswith("Bearer "):
            user_token = user_token.split("Bearer ")[1]
        try:
            payload = decode_access_token(user_token)
            user_id = payload.get("sub")
            if user_id:
                user = (
                    db.query(UserModel)
                    .filter(UserModel.id == int(user_id))
                    .first()
                )
                if user:
                    return user
        except Exception as e:
            logger.debug(f"User token decoding failed: {e}")

    return None


@router.get("", response_model=List[IntegrationSettingResponse])
def get_integrations(
    current_user: UserModel = Depends(require_admin),
    db: Session = Depends(get_db),
):
    integrations = db.query(IntegrationSettingModel).all()
    return integrations


@router.get("/active-key")
def get_active_integration_key(
    db: Session = Depends(get_db),
):
    integration = (
        db.query(IntegrationSettingModel)
        .order_by(IntegrationSettingModel.id.desc())
        .first()
    )
    if not integration:
        admin_user = (
            db.query(UserModel).filter(UserModel.role == "admin").first()
        )
        if not admin_user:
            admin_user = db.query(UserModel).first()

        user_id = admin_user.id if admin_user else 1

        integration = IntegrationSettingModel(
            user_id=user_id,
            system_name="Hospital Billing System",
            organization_name="General Hospital POS",
            status="Active",
        )
        db.add(integration)
        db.commit()
        db.refresh(integration)

    return {
        "api_key": integration.api_key,
        "system_name": integration.system_name,
        "organization_name": integration.organization_name,
        "status": integration.status,
    }


@router.post("", response_model=IntegrationSettingResponse)
def create_integration(
    payload: IntegrationSettingCreate,
    current_user: UserModel = Depends(require_admin),
    db: Session = Depends(get_db),
):
    new_integration = IntegrationSettingModel(
        user_id=current_user.id,
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
    request: Request,
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

    # Resolve logged in user from request token if present, else default to integration owner
    target_user = resolve_user_from_request(request, db)
    target_user_id = target_user.id if target_user else integration.user_id

    receipt = ReceiptModel(
        user_id=target_user_id,
        merchant_name=integration.organization_name,
        merchant_category=(
            f"Patient: {payload.customer_name}"
            if payload.customer_name
            else "Hospital Services"
        ),
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

