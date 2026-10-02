from sqlalchemy import inspect, text

from app.core.database import Base, engine
from app.models import (
    ReceiptImageModel,
    ReceiptItemModel,
    ReceiptModel,
    UserModel,
    VisionAnalysisModel,
)


def initialize_database():
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


if __name__ == "__main__":
    initialize_database()
    print("SmartReceiptAI V2 database initialized.")