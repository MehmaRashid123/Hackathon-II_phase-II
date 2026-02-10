"""
Workspace management API endpoints.
"""
from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from typing import List
from uuid import UUID
from ..database import get_session
from ..schemas.workspace_schemas import WorkspaceCreate, WorkspaceUpdate, WorkspaceResponse
from ..services.workspace_service import WorkspaceService
from ..middleware.auth import get_current_user_id


router = APIRouter(prefix="/api/workspaces", tags=["Workspaces"])


@router.get("/", response_model=List[WorkspaceResponse])
async def list_workspaces(
    session: Session = Depends(get_session),
    user_id: UUID = Depends(get_current_user_id)
):
    """
    Get all workspaces for the authenticated user.
    
    Returns a list of all workspaces belonging to the user, ordered by creation date (newest first).
    Requires valid JWT token.
    """
    workspaces = WorkspaceService.get_user_workspaces(session, user_id)
    return workspaces


@router.post("/", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
async def create_workspace(
    workspace_data: WorkspaceCreate,
    session: Session = Depends(get_session),
    user_id: UUID = Depends(get_current_user_id)
):
    """
    Create a new workspace for the authenticated user.
    
    - **name**: Workspace name (1-200 characters, required)
    - **description**: Workspace description (0-1000 characters, optional)
    
    Returns the created workspace with auto-generated ID and timestamps.
    Requires valid JWT token.
    """
    workspace = WorkspaceService.create_workspace(session, user_id, workspace_data)
    return workspace


@router.get("/{workspace_id}", response_model=WorkspaceResponse)
async def get_workspace(
    workspace_id: UUID,
    session: Session = Depends(get_session),
    user_id: UUID = Depends(get_current_user_id)
):
    """
    Get details of a specific workspace.
    
    Returns the workspace details if it exists and belongs to the authenticated user.
    Requires valid JWT token.
    """
    workspace = WorkspaceService.get_workspace_by_id(session, user_id, workspace_id)
    return workspace


@router.put("/{workspace_id}", response_model=WorkspaceResponse)
async def update_workspace(
    workspace_id: UUID,
    update_data: WorkspaceUpdate,
    session: Session = Depends(get_session),
    user_id: UUID = Depends(get_current_user_id)
):
    """
    Update a workspace's name and/or description.
    
    - **name**: Updated workspace name (optional)
    - **description**: Updated workspace description (optional)
    
    Returns the updated workspace.
    Requires valid JWT token.
    """
    workspace = WorkspaceService.update_workspace(session, user_id, workspace_id, update_data)
    return workspace


@router.delete("/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workspace(
    workspace_id: UUID,
    session: Session = Depends(get_session),
    user_id: UUID = Depends(get_current_user_id)
):
    """
    Permanently delete a workspace.
    
    Removes the workspace from the database if it exists and belongs to the authenticated user.
    Returns 204 No Content on success.
    Requires valid JWT token.
    """
    WorkspaceService.delete_workspace(session, user_id, workspace_id)
    return None
