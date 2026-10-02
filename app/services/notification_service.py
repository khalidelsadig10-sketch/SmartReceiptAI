from sqlalchemy.orm import Session

from app.models.notification import NotificationModel


class NotificationService:

    @staticmethod
    def create(
        db: Session,
        user_id: int,
        notification_type: str,
        title: str,
        message: str,
        reference_id: int | None = None,
    ) -> NotificationModel:

        notification = NotificationModel(
            user_id=user_id,
            type=notification_type,
            title=title,
            message=message,
            is_read=False,
            reference_id=reference_id,
        )

        db.add(notification)
        db.flush()

        return notification