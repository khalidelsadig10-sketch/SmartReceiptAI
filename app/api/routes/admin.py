from pathlib import Path
from typing import Literal

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.api.routes.auth import (
    get_db,
    hash_password,
    require_admin,
)

from app.models.receipt import ReceiptModel
from app.models.user import UserModel


router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Admin"],
)


# =========================================================
# ADMIN ACCESS CHECK
# =========================================================

@router.get("/check")
def admin_check(
    current_user: UserModel = Depends(
        require_admin
    ),
):
    return {
        "success": True,
        "message": "Admin access granted.",
        "user": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "role": current_user.role,
        },
    }


# =========================================================
# LIST USERS
# =========================================================

@router.get("/users")
def list_users(
    current_user: UserModel = Depends(
        require_admin
    ),
    db: Session = Depends(get_db),
):
    users = db.scalars(
        select(UserModel).order_by(
            UserModel.id.desc()
        )
    ).all()

    return {
        "success": True,
        "count": len(users),
        "users": [
            {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "profile_image": user.profile_image,
                "is_active": user.is_active,
                "role": user.role,
                "created_at": user.created_at,
            }
            for user in users
        ],
    }


# =========================================================
# ADMIN OVERVIEW
# =========================================================

@router.get("/overview")
def admin_overview(
    current_user: UserModel = Depends(
        require_admin
    ),
    db: Session = Depends(get_db),
):
    total_users = db.scalar(
        select(
            func.count(UserModel.id)
        )
    ) or 0

    active_users = db.scalar(
        select(
            func.count(UserModel.id)
        ).where(
            UserModel.is_active == True
        )
    ) or 0

    admin_users = db.scalar(
        select(
            func.count(UserModel.id)
        ).where(
            UserModel.role == "admin"
        )
    ) or 0

    total_receipts = db.scalar(
        select(
            func.count(ReceiptModel.id)
        )
    ) or 0

    return {
        "success": True,
        "overview": {
            "total_users": total_users,
            "active_users": active_users,
            "admin_users": admin_users,
            "total_receipts": total_receipts,
        },
    }


# =========================================================
# RECEIPT ANALYTICS
# =========================================================

@router.get("/receipt-analytics")
def receipt_analytics(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(
        require_admin
    ),
):
    # -----------------------------------------------------
    # Monthly receipt activity
    # -----------------------------------------------------

    monthly_rows = (
        db.query(
            func.date_format(
                ReceiptModel.created_at,
                "%Y-%m",
            ).label("month"),

            func.count(
                ReceiptModel.id
            ).label("receipt_count"),
        )
        .group_by(
            func.date_format(
                ReceiptModel.created_at,
                "%Y-%m",
            )
        )
        .order_by(
            func.date_format(
                ReceiptModel.created_at,
                "%Y-%m",
            )
        )
        .all()
    )

    monthly = [
        {
            "month": row.month,
            "receipt_count": int(
                row.receipt_count or 0
            ),
        }
        for row in monthly_rows
    ]


    # -----------------------------------------------------
    # Currency distribution
    # -----------------------------------------------------

    currency_rows = (
        db.query(
            ReceiptModel.currency.label(
                "currency"
            ),

            func.count(
                ReceiptModel.id
            ).label(
                "receipt_count"
            ),
        )
        .group_by(
            ReceiptModel.currency
        )
        .order_by(
            func.count(
                ReceiptModel.id
            ).desc()
        )
        .all()
    )

    currencies = [
        {
            "currency":
                row.currency or "Unknown",

            "receipt_count":
                int(
                    row.receipt_count or 0
                ),
        }
        for row in currency_rows
    ]


    # -----------------------------------------------------
    # Receipt activity by user
    # -----------------------------------------------------

    user_rows = (
        db.query(
            UserModel.id.label(
                "user_id"
            ),

            UserModel.full_name.label(
                "full_name"
            ),

            func.count(
                ReceiptModel.id
            ).label(
                "receipt_count"
            ),
        )
        .join(
            ReceiptModel,
            ReceiptModel.user_id ==
            UserModel.id,
        )
        .group_by(
            UserModel.id,
            UserModel.full_name,
        )
        .order_by(
            func.count(
                ReceiptModel.id
            ).desc()
        )
        .limit(10)
        .all()
    )

    users = [
        {
            "user_id":
                int(row.user_id),

            "full_name":
                row.full_name or
                "Unnamed User",

            "receipt_count":
                int(
                    row.receipt_count or 0
                ),
        }
        for row in user_rows
    ]


    return {
        "success": True,
        "analytics": {
            "monthly": monthly,
            "currencies": currencies,
            "users": users,
        },
    }


# =========================================================
# USER STATUS REQUEST
# =========================================================

class UserStatusRequest(BaseModel):
    is_active: bool


# =========================================================
# UPDATE USER STATUS
# =========================================================

@router.put("/users/{user_id}/status")
def update_user_status(
    user_id: int,
    data: UserStatusRequest,
    current_user: UserModel = Depends(
        require_admin
    ),
    db: Session = Depends(get_db),
):
    if (
        user_id == current_user.id
        and not data.is_active
    ):
        return {
            "success": False,
            "message":
                "You cannot disable your own admin account.",
        }


    user = db.get(
        UserModel,
        user_id,
    )

    if user is None:
        return {
            "success": False,
            "message":
                "User not found.",
        }


    if (
        user.role == "admin"
        and user.is_active
        and not data.is_active
    ):
        active_admins = db.scalars(
            select(UserModel).where(
                UserModel.role == "admin",
                UserModel.is_active == True,
            )
        ).all()

        if len(active_admins) <= 1:
            return {
                "success": False,
                "message":
                    "The last active admin cannot be disabled.",
            }


    user.is_active = data.is_active

    db.add(user)
    db.commit()
    db.refresh(user)


    return {
        "success": True,
        "message": (
            "User activated successfully."
            if user.is_active
            else "User disabled successfully."
        ),
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "is_active": user.is_active,
            "role": user.role,
        },
    }


# =========================================================
# ADVANCED USER MANAGEMENT
# =========================================================

class CreateAdminRequest(BaseModel):

    full_name: str

    email: str

    password: str


class UserRoleRequest(BaseModel):

    role: Literal["user", "admin"]


# =========================================================
# CREATE ADMIN
# =========================================================

@router.post(
    "/users/admin",
    status_code=status.HTTP_201_CREATED,
)
def create_admin_user(
    data: CreateAdminRequest,
    current_user: UserModel = Depends(
        require_admin
    ),
    db: Session = Depends(get_db),
):
    full_name = data.full_name.strip()
    email = data.email.lower().strip()
    password = data.password


    if not full_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Full name is required.",
        )


    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is required.",
        )


    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least 8 characters.",
        )


    existing_user = db.scalar(
        select(UserModel).where(
            UserModel.email == email
        )
    )


    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )


    user = UserModel(
        full_name=full_name,
        email=email,
        password_hash=hash_password(
            password
        ),
        is_active=True,
        role="admin",
    )


    db.add(user)
    db.commit()
    db.refresh(user)


    return {
        "success": True,
        "message": "Administrator created successfully.",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "is_active": user.is_active,
            "role": user.role,
            "created_at": user.created_at,
        },
    }


# =========================================================
# CHANGE USER ROLE
# =========================================================

@router.put(
    "/users/{user_id}/role"
)
def update_user_role(
    user_id: int,
    data: UserRoleRequest,
    current_user: UserModel = Depends(
        require_admin
    ),
    db: Session = Depends(get_db),
):
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot change your own admin role.",
        )


    user = db.get(
        UserModel,
        user_id,
    )


    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )


    if (
        user.role == "admin"
        and data.role == "user"
        and user.is_active
    ):
        active_admin_count = db.scalar(
            select(
                func.count(UserModel.id)
            ).where(
                UserModel.role == "admin",
                UserModel.is_active == True,
            )
        ) or 0


        if active_admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "The last active admin cannot "
                    "be changed to a regular user."
                ),
            )


    user.role = data.role

    db.add(user)
    db.commit()
    db.refresh(user)


    return {
        "success": True,
        "message": "User role updated successfully.",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "is_active": user.is_active,
            "role": user.role,
        },
    }


# =========================================================
# DELETE USER
# =========================================================

@router.delete(
    "/users/{user_id}"
)
def delete_user(
    user_id: int,
    current_user: UserModel = Depends(
        require_admin
    ),
    db: Session = Depends(get_db),
):
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own admin account.",
        )


    user = db.get(
        UserModel,
        user_id,
    )


    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )


    if user.role == "admin":

        admin_count = db.scalar(
            select(
                func.count(UserModel.id)
            ).where(
                UserModel.role == "admin"
            )
        ) or 0


        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The last administrator cannot be deleted.",
            )


    profile_image_path = None

    if user.profile_image:
        profile_image_path = Path(
            user.profile_image
        )


    # -----------------------------------------------------
    # Delete user's receipts first
    # Receipt children use cascade relationships.
    # -----------------------------------------------------

    receipts = list(
        user.receipts
    )


    for receipt in receipts:
        db.delete(receipt)


    db.flush()


    # -----------------------------------------------------
    # Delete user
    # -----------------------------------------------------

    db.delete(user)
    db.commit()


    # -----------------------------------------------------
    # Remove profile image if it exists
    # -----------------------------------------------------

    if (
        profile_image_path
        and profile_image_path.exists()
    ):
        try:
            profile_image_path.unlink()
        except OSError:
            pass


    return {
        "success": True,
        "message": "User deleted successfully.",
        "user_id": user_id,
        "deleted_receipts": len(receipts),
    }


# =========================================================
# ADMIN RECEIPT MANAGEMENT
# =========================================================

@router.get("/receipts")
def admin_receipts(
    current_user: UserModel = Depends(
        require_admin
    ),
    db: Session = Depends(get_db),
):
    receipts = db.scalars(
        select(ReceiptModel)
        .options(
            joinedload(
                ReceiptModel.user
            )
        )
        .order_by(
            ReceiptModel.created_at.desc()
        )
        .limit(500)
    ).all()


    return {
        "success": True,
        "count": len(receipts),
        "receipts": [
            {
                "id": receipt.id,
                "user_id": receipt.user_id,
                "user_name": (
                    receipt.user.full_name
                    if receipt.user
                    else "Unknown User"
                ),
                "merchant_name":
                    receipt.merchant_name,
                "merchant_category":
                    receipt.merchant_category,
                "invoice_number":
                    receipt.invoice_number,
                "receipt_date":
                    receipt.receipt_date,
                "receipt_time":
                    receipt.receipt_time,
                "currency":
                    receipt.currency,
                "subtotal":
                    receipt.subtotal,
                "tax":
                    receipt.tax,
                "tax_rate":
                    receipt.tax_rate,
                "discount":
                    receipt.discount,
                "total":
                    receipt.total,
                "payment_method":
                    receipt.payment_method,
                "created_at":
                    receipt.created_at,
            }
            for receipt in receipts
        ],
    }


# =========================================================
# GET RECEIPT DETAILS
# =========================================================

@router.get(
    "/receipts/{receipt_id}"
)
def admin_receipt_details(
    receipt_id: int,
    current_user: UserModel = Depends(
        require_admin
    ),
    db: Session = Depends(get_db),
):
    receipt = db.get(
        ReceiptModel,
        receipt_id,
    )


    if receipt is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receipt not found.",
        )


    return {
        "success": True,
        "receipt": {
            "id": receipt.id,
            "user_id": receipt.user_id,
            "user_name": (
                receipt.user.full_name
                if receipt.user
                else "Unknown User"
            ),
            "merchant_name":
                receipt.merchant_name,
            "merchant_category":
                receipt.merchant_category,
            "merchant_address":
                receipt.merchant_address,
            "merchant_phone":
                receipt.merchant_phone,
            "invoice_number":
                receipt.invoice_number,
            "receipt_date":
                receipt.receipt_date,
            "receipt_time":
                receipt.receipt_time,
            "currency":
                receipt.currency,
            "subtotal":
                receipt.subtotal,
            "tax":
                receipt.tax,
            "tax_rate":
                receipt.tax_rate,
            "discount":
                receipt.discount,
            "total":
                receipt.total,
            "payment_method":
                receipt.payment_method,
            "created_at":
                receipt.created_at,

            "items": [
                {
                    "id": item.id,
                    "name": item.name,
                    "quantity":
                        item.quantity,
                    "unit_price":
                        item.unit_price,
                    "total_price":
                        item.total_price,
                }
                for item in receipt.items
            ],

            "images": [
                {
                    "id": image.id,
                    "file_name":
                        image.file_name,
                    "file_path":
                        image.file_path,
                    "mime_type":
                        image.mime_type,
                }
                for image in receipt.images
            ],

            "vision_analyses": [
                {
                    "id": analysis.id,
                    "model_name":
                        analysis.model_name,
                    "status":
                        analysis.status,
                    "created_at":
                        analysis.created_at,
                }
                for analysis in receipt.vision_analyses
            ],
        },
    }


# =========================================================
# DELETE RECEIPT
# =========================================================

@router.delete(
    "/receipts/{receipt_id}"
)
def delete_admin_receipt(
    receipt_id: int,
    current_user: UserModel = Depends(
        require_admin
    ),
    db: Session = Depends(get_db),
):
    receipt = db.get(
        ReceiptModel,
        receipt_id,
    )


    if receipt is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receipt not found.",
        )


    image_paths = [
        Path(image.file_path)
        for image in receipt.images
        if image.file_path
    ]


    db.delete(receipt)
    db.commit()


    for image_path in image_paths:

        if image_path.exists():

            try:
                image_path.unlink()
            except OSError:
                pass


    return {
        "success": True,
        "message": "Receipt deleted successfully.",
        "receipt_id": receipt_id,
    }