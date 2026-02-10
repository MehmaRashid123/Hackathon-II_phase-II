"""
Task model for todo items.
"""
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime
from uuid import UUID, uuid4
from enum import Enum

if TYPE_CHECKING:
    from .user import User


class TaskStatus(str, Enum):
    """Task status enum for Kanban board."""
    TO_DO = "TO_DO"
    IN_PROGRESS = "IN_PROGRESS"
    REVIEW = "REVIEW"
    DONE = "DONE"


class Task(SQLModel, table=True):
    """Task model representing a todo item."""
    
    __tablename__ = "tasks"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(min_length=1, max_length=500, nullable=False)
    description: Optional[str] = Field(default=None, max_length=5000)
    is_completed: bool = Field(default=False)
    status: str = Field(default="TO_DO", nullable=False)  # Kanban status
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign key to user (cascade delete handled in migration)
    user_id: UUID = Field(
        foreign_key="users.id",
        nullable=False,
        index=True
    )
    
    # Relationship to user
    user: Optional["User"] = Relationship(back_populates="tasks")
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Complete project documentation",
                "description": "Write comprehensive docs for the API",
                "is_completed": False,
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00"
            }
        }
