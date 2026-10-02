from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings


# =========================================================
# Database URL
# =========================================================

DATABASE_URL = URL.create(
    drivername="mysql+pymysql",
    username=settings.DB_USER,
    password=settings.DB_PASSWORD,
    host=settings.DB_HOST,
    port=settings.DB_PORT,
    database=settings.DB_NAME,
)


# =========================================================
# Base
# =========================================================

class Base(DeclarativeBase):
    pass


# =========================================================
# Engine
# =========================================================

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)


# =========================================================
# Session
# =========================================================

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)