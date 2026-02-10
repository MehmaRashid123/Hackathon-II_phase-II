"""
Workspace service for workspace management business logic.
"""
from sqlmodel import Session, select
from typing import List
from datetime import datetime
from uuid import UUID
from ..models.workspace import Workspace
from ..schemas.workspace_schemas import WorkspaceCreate, WorkspaceUpdate
from fastapi import HTTPException, status


class WorkspaceService:
    """Service class for workspace-related operations."""
    
    @staticmethod
    def get_user_workspaces(session: Session, user_id: UUID) -> List[Workspace]:
        """
        Get all workspaces for a specific user.
        
        Args:
            session: Database session
            user_id: User ID to filter workspaces
            
        Returns:
            List of workspaces belonging to the user
        """
        statement = select(Workspace).where(Workspace.owner_id == user_id).order_by(Workspace.created_at.desc())
        workspaces = session.exec(statement).all()
        return list(workspaces)
    
    @staticmethod
    def create_workspace(session: Session, user_id: UUID, workspace_data: WorkspaceCreate) -> Workspace:
        """
        Create a new workspace for a user.
        
        Args:
            session: Database session
            user_id: User ID who owns the workspace
            workspace_data: Workspace creation data
            
        Returns:
            Created workspace object
        """
        workspace = Workspace(
            name=workspace_data.name,
            description=workspace_data.description,
            owner_id=user_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        session.add(workspace)
        session.commit()
        session.refresh(workspace)
        
        return workspace
    
    @staticmethod
    def get_workspace_by_id(session: Session, user_id: UUID, workspace_id: UUID) -> Workspace:
        """
        Get a specific workspace by ID, ensuring it belongs to the user.
        
        Args:
            session: Database session
            user_id: User ID to verify ownership
            workspace_id: Workspace ID to retrieve
            
        Returns:
            Workspace object
            
        Raises:
            HTTPException: If workspace not found or doesn't belong to user
        """
        statement = select(Workspace).where(Workspace.id == workspace_id, Workspace.owner_id == user_id)
        workspace = session.exec(statement).first()
        
        if not workspace:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace not found"
            )
        
        return workspace
    
    @staticmethod
    def update_workspace(session: Session, user_id: UUID, workspace_id: UUID, update_data: WorkspaceUpdate) -> Workspace:
        """
        Update a workspace's details.
        
        Args:
            session: Database session
            user_id: User ID to verify ownership
            workspace_id: Workspace ID to update
            update_data: Updated workspace data
            
        Returns:
            Updated workspace object
            
        Raises:
            HTTPException: If workspace not found or doesn't belong to user
        """
        workspace = WorkspaceService.get_workspace_by_id(session, user_id, workspace_id)
        
        # Update only provided fields
        if update_data.name is not None:
            workspace.name = update_data.name
        if update_data.description is not None:
            workspace.description = update_data.description
        
        workspace.updated_at = datetime.utcnow()
        
        session.add(workspace)
        session.commit()
        session.refresh(workspace)
        
        return workspace
    
    @staticmethod
    def delete_workspace(session: Session, user_id: UUID, workspace_id: UUID) -> None:
        """
        Delete a workspace.
        
        Args:
            session: Database session
            user_id: User ID to verify ownership
            workspace_id: Workspace ID to delete
            
        Raises:
            HTTPException: If workspace not found or doesn't belong to user
        """
        workspace = WorkspaceService.get_workspace_by_id(session, user_id, workspace_id)
        
        session.delete(workspace)
        session.commit()
