"""
Check user workspace membership
"""
from src.database import engine
from sqlmodel import Session, text

workspace_id = "1fa6f37a-852d-4548-814a-b288c9eedcf3"

with Session(engine) as session:
    try:
        # Check workspace
        result = session.exec(text("""
            SELECT id, name, created_by 
            FROM workspace
            WHERE id = :workspace_id
        """).bindparams(workspace_id=workspace_id))
        
        workspace = result.one_or_none()
        if workspace:
            print(f"✅ Workspace found:")
            print(f"   ID: {workspace[0]}")
            print(f"   Name: {workspace[1]}")
            print(f"   Created by: {workspace[2]}")
        else:
            print(f"❌ Workspace not found")
            exit(1)
        
        # Check workspace members
        result = session.exec(text("""
            SELECT user_id, role 
            FROM workspacemember
            WHERE workspace_id = :workspace_id
        """).bindparams(workspace_id=workspace_id))
        
        members = result.all()
        print(f"\n✅ Workspace members in workspacemember table ({len(members)}):")
        for member in members:
            print(f"   User: {member[0]}, Role: {member[1]}")
        
        # Check workspace_members table too
        result = session.exec(text("""
            SELECT user_id, role 
            FROM workspace_members
            WHERE workspace_id = :workspace_id
        """).bindparams(workspace_id=workspace_id))
        
        members2 = result.all()
        print(f"\n✅ workspace_members table ({len(members2)}):")
        for member in members2:
            print(f"   User: {member[0]}, Role: {member[1]}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
