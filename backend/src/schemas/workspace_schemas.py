"""
Pydantic schemas for workspace endpoints.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class WorkspaceCreate(BaseModel):
    """Schema for creating a new workspace."""
    name: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Personal Projects",
                "description": "My personal todo items"
            }
        }


class WorkspaceUpdate(BaseModel):
    """Schema for updating an existing workspace."""
    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Updated Workspace Name",
                "description": "Updated description"
            }
        }


class WorkspaceResponse(BaseModel):
    """Schema for workspace response."""
    id: UUID
    name: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime
    owner_id: UUID
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "name": "Personal Projects",
                "description": "My personal todo items",
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00",
                "owner_id": "123e4567-e89b-12d3-a456-426614174001"
            }
        }
