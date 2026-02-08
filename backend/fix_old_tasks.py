"""
Fix old tasks - assign to first user and first workspace
"""
from src.database import engine
from sqlmodel import Session, select, text

with Session(engine) as session:
    # Get first user
    result = session.exec(text("SELECT id FROM users LIMIT 1"))
    first_user = result.first()
    
    if not first_user:
        print("❌ No users found!")
        exit(1)
    
    user_id = first_user[0]
    print(f"Using user ID: {user_id}")
    
    # Get first workspace
    result = session.exec(text("SELECT id, name FROM workspace LIMIT 1"))
    first_workspace = result.first()
    
    if not first_workspace:
        print("❌ No workspaces found!")
        exit(1)
    
    workspace_id = first_workspace[0]
    workspace_name = first_workspace[1]
    print(f"Using workspace: {workspace_name} ({workspace_id})")
    
    # Update all tasks without created_by or workspace_id
    result = session.exec(text(f"""
        UPDATE tasks 
        SET created_by = '{user_id}', 
            workspace_id = '{workspace_id}'
        WHERE created_by IS NULL OR workspace_id IS NULL
        RETURNING id
    """))
    
    updated_ids = result.all()
    session.commit()
    
    print(f"\n✅ Updated {len(updated_ids)} tasks")
    print(f"   - Assigned to user: {user_id}")
    print(f"   - Assigned to workspace: {workspace_name}")
