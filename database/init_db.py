from app.core.database import Base, engine

from app.models.receipt import ReceiptModel
from app.models.receipt_item import ReceiptItemModel
from app.models.receipt_image import ReceiptImageModel
from app.models.vision_analysis import VisionAnalysisModel


def init_database():
    Base.metadata.create_all(bind=engine)
    print("DATABASE INITIALIZED SUCCESSFULLY")


if __name__ == "__main__":
    init_database()