"""
Workspace model for organizing tasks.
"""
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from uuid import UUID, uuid4

if TYPE_CHECKING:
    from .user import User


class Workspace(SQLModel, table=True):
    """Workspace model for organizing tasks and projects."""
    
    __tablename__ = "workspaces"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(min_length=1, max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Owner of the workspace
    owner_id: UUID = Field(foreign_key="users.id", nullable=False, index=True)
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Personal Projects",
                "description": "My personal todo items",
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00"
            }
        }
