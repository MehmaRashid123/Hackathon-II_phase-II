"""
Check workspace membership for debugging
"""
from src.database import engine
from sqlmodel import Session, text

with Session(engine) as session:
    # Get all workspace members
    result = session.exec(text("""
        SELECT 
            wm.workspace_id,
            w.name as workspace_name,
            wm.user_id,
            u.email as user_email,
            wm.role
        FROM workspacemember wm
        JOIN workspace w ON w.id = wm.workspace_id
        JOIN users u ON u.id = wm.user_id
        ORDER BY w.name, u.email
    """))
    
    memberships = result.all()
    
    if memberships:
        print("✅ Workspace Memberships:")
        print("-" * 80)
        for workspace_id, workspace_name, user_id, user_email, role in memberships:
            print(f"Workspace: {workspace_name}")
            print(f"  User: {user_email}")
            print(f"  Role: {role}")
            print(f"  Workspace ID: {workspace_id}")
            print(f"  User ID: {user_id}")
            print()
    else:
        print("⚠️  No workspace memberships found!")
        
    # Check if there are workspaces without members
    result = session.exec(text("""
        SELECT w.id, w.name, w.created_by
        FROM workspace w
        LEFT JOIN workspacemember wm ON wm.workspace_id = w.id
        WHERE wm.id IS NULL
    """))
    
    orphan_workspaces = result.all()
    if orphan_workspaces:
        print("\n⚠️  Workspaces without members:")
        for ws_id, ws_name, created_by in orphan_workspaces:
            print(f"  - {ws_name} (ID: {ws_id}, Created by: {created_by})")
