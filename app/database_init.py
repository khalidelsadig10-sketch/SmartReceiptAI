from sqlalchemy import inspect, text

from app.core.database import Base, engine

# Import ALL models so Base.metadata.create_all() knows about every table
from app.models import (
    ReceiptImageModel,
    ReceiptItemModel,
    ReceiptModel,
    UserModel,
    VisionAnalysisModel,
    UserSettingsModel,
    NotificationModel,
    IntegrationSettingModel,
)
from app.models.password_reset_token import PasswordResetTokenModel
from app.models.user_session import UserSessionModel


def initialize_database():
    # This creates ALL tables in the correct dependency order
    Base.metadata.create_all(bind=engine)

    inspector = inspect(engine)

    receipts_columns = {
        column["name"]
        for column in inspector.get_columns("receipts")
    }

    if "user_id" not in receipts_columns:
        with engine.begin() as connection:
            connection.execute(
                text(
                    """
                    ALTER TABLE receipts
                    ADD COLUMN user_id INTEGER
                    """
                )
            )

    if "source" not in receipts_columns:
        with engine.begin() as connection:
            connection.execute(
                text(
                    """
                    ALTER TABLE receipts
                    ADD COLUMN source VARCHAR(50) NOT NULL DEFAULT 'scanned'
                    """
                )
            )

    if "integration_id" not in receipts_columns:
        with engine.begin() as connection:
            connection.execute(
                text(
                    """
                    ALTER TABLE receipts
                    ADD COLUMN integration_id INTEGER
                    """
                )
            )

if __name__ == "__main__":
    initialize_database()
    print("SmartReceiptAI V2 database initialized.")