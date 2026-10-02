import pytest

from app.main import app
from app.core.database import SessionLocal
from app.core.mock_vision_engine import MockVisionEngine
from app.core.security import hash_password
from app.models.user import UserModel
from app.services.receipt_pipeline import ReceiptPipeline

from app.api.routes.auth import get_current_user
from app.api.routes.receipt import get_receipt_pipeline


# =========================================================
# Test User
# =========================================================

@pytest.fixture
def test_user():
    db = SessionLocal()

    try:
        email = "pytest@smartreceiptai.local"

        user = (
            db.query(UserModel)
            .filter(
                UserModel.email == email
            )
            .first()
        )

        if user is None:
            user = UserModel(
                email=email,
                password_hash=hash_password(
                    "TestPassword123!"
                ),
                is_active=True,
            )

            db.add(user)
            db.commit()
            db.refresh(user)

        yield user

    finally:
        db.close()


# =========================================================
# Automatic Authentication
# =========================================================

@pytest.fixture(autouse=True)
def override_current_user(test_user):
    app.dependency_overrides[
        get_current_user
    ] = lambda: test_user

    yield test_user

    app.dependency_overrides.pop(
        get_current_user,
        None,
    )


# =========================================================
# Mock Receipt Pipeline
# =========================================================

@pytest.fixture
def mock_receipt_pipeline():
    return ReceiptPipeline(
        vision_engine=MockVisionEngine()
    )


# =========================================================
# Authenticated Mock Receipt Pipeline
# =========================================================

@pytest.fixture
def override_receipt_pipeline(
    mock_receipt_pipeline,
):
    app.dependency_overrides[
        get_receipt_pipeline
    ] = lambda: mock_receipt_pipeline

    yield mock_receipt_pipeline

    app.dependency_overrides.pop(
        get_receipt_pipeline,
        None,
    )