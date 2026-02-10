"""
Database configuration and session management.
Handles Neon PostgreSQL connection with SQLModel.
"""
from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
from .config import settings


# Create database engine with connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    echo=True if settings.ENVIRONMENT == "development" else False,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,  # Verify connections before using
    pool_recycle=3600,   # Recycle connections after 1 hour
)


def create_db_and_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a database session.
    Automatically handles session lifecycle and cleanup.
    """
    with Session(engine) as session:
        yield session
