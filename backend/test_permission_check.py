"""
Test permission check for task creation
"""
from src.database import engine
from sqlmodel import Session
from src.services.permissions import PermissionService
import uuid

with Session(engine) as session:
    # Use testuser's workspace
    user_id = uuid.UUID("3a3031e1-bb94-4135-bd0d-a8d1d66764b3")
    workspace_id = uuid.UUID("2a373ba6-3b7e-4da3-a5a0-bc83f7fb31fe")
    
    print(f"Testing permissions for:")
    print(f"  User ID: {user_id}")
    print(f"  Workspace ID: {workspace_id}")
    print()
    
    # Check if user has workspace access
    has_access = PermissionService.user_has_workspace_access(session, user_id, workspace_id)
    print(f"Has workspace access: {has_access}")
    
    # Check if user can edit tasks
    can_edit = PermissionService.user_can_edit_task(session, user_id, workspace_id)
    print(f"Can edit tasks: {can_edit}")
    
    # Get user's role
    role = PermissionService.get_user_workspace_role(session, user_id, workspace_id)
    print(f"User role: {role}")
