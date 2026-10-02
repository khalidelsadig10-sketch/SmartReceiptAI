from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.core.database import SessionLocal
from app.models.notification import NotificationModel
from app.models.user import UserModel


# =========================================================
# Router
# =========================================================

router = APIRouter(
    prefix="/api/v1/notifications",
    tags=["Notifications"],
)


# =========================================================
# Database Dependency
# =========================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================================================
# Get Notifications
# =========================================================

@router.get("/")
async def get_notifications(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    notifications = (
        db.query(NotificationModel)
        .filter(
            NotificationModel.user_id
            == current_user.id
        )
        .order_by(
            NotificationModel.created_at.desc()
        )
        .all()
    )

    unread_count = sum(
        1
        for notification in notifications
        if not notification.is_read
    )

    return {
        "success": True,
        "unread_count": unread_count,
        "notifications": [
            {
                "id": notification.id,
                "type": notification.type,
                "title": notification.title,
                "message": notification.message,
                "is_read": notification.is_read,
                "reference_id": notification.reference_id,
                "created_at": (
                    notification.created_at.isoformat()
                    if notification.created_at
                    else None
                ),
            }
            for notification in notifications
        ],
    }


# =========================================================
# Get Unread Count
# =========================================================

@router.get("/unread-count")
async def get_unread_count(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    count = (
        db.query(NotificationModel)
        .filter(
            NotificationModel.user_id
            == current_user.id,
            NotificationModel.is_read
            == False,
        )
        .count()
    )

    return {
        "success": True,
        "unread_count": count,
    }


# =========================================================
# Mark Notification As Read
# =========================================================

@router.put("/{notification_id}/read")
async def mark_notification_as_read(
    notification_id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    notification = (
        db.query(NotificationModel)
        .filter(
            NotificationModel.id
            == notification_id,
            NotificationModel.user_id
            == current_user.id,
        )
        .first()
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found.",
        )

    notification.is_read = True

    db.commit()
    db.refresh(notification)

    return {
        "success": True,
        "message": "Notification marked as read.",
        "notification": {
            "id": notification.id,
            "is_read": notification.is_read,
        },
    }


# =========================================================
# Mark All Notifications As Read
# =========================================================

@router.put("/read-all")
async def mark_all_notifications_as_read(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    notifications = (
        db.query(NotificationModel)
        .filter(
            NotificationModel.user_id
            == current_user.id,
            NotificationModel.is_read
            == False,
        )
        .all()
    )

    for notification in notifications:
        notification.is_read = True

    db.commit()

    return {
        "success": True,
        "message": "All notifications marked as read.",
        "updated": len(notifications),
    }


# =========================================================
# Delete Notification
# =========================================================

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    notification = (
        db.query(NotificationModel)
        .filter(
            NotificationModel.id
            == notification_id,
            NotificationModel.user_id
            == current_user.id,
        )
        .first()
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found.",
        )

    db.delete(notification)
    db.commit()

    return {
        "success": True,
        "message": "Notification deleted successfully.",
        "notification_id": notification_id,
    }