"""
Pydantic schemas for task endpoints.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class TaskCreate(BaseModel):
    """Schema for creating a new task."""
    title: str = Field(min_length=1, max_length=500)
    description: Optional[str] = Field(default=None, max_length=5000)
    status: Optional[str] = Field(default="TO_DO")
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Complete project documentation",
                "description": "Write comprehensive docs for the API",
                "status": "TO_DO"
            }
        }


class TaskUpdate(BaseModel):
    """Schema for updating an existing task."""
    title: Optional[str] = Field(default=None, min_length=1, max_length=500)
    description: Optional[str] = Field(default=None, max_length=5000)
    status: Optional[str] = Field(default=None)
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Updated task title",
                "description": "Updated description",
                "status": "IN_PROGRESS"
            }
        }


class TaskResponse(BaseModel):
    """Schema for task response."""
    id: UUID
    title: str
    description: Optional[str]
    is_completed: bool
    status: str
    created_at: datetime
    updated_at: datetime
    user_id: UUID
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "title": "Complete project documentation",
                "description": "Write comprehensive docs for the API",
                "is_completed": False,
                "status": "TO_DO",
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00",
                "user_id": "123e4567-e89b-12d3-a456-426614174001"
            }
        }
