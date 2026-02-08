"""
Add testuser to gemini workspace
"""
from src.database import engine
from sqlmodel import Session, text
import uuid

workspace_id = "1fa6f37a-852d-4548-814a-b288c9eedcf3"
user_id = "3a3031e1-bb94-4135-bd0d-a8d1d66764b3"  # testuser@example.com

with Session(engine) as session:
    try:
        # Check if already a member
        result = session.exec(text("""
            SELECT user_id FROM workspacemember
            WHERE workspace_id = :workspace_id AND user_id = :user_id
        """).bindparams(workspace_id=workspace_id, user_id=user_id))
        
        if result.one_or_none():
            print("✅ User is already a member of this workspace")
        else:
            # Add user as MEMBER
            session.exec(text("""
                INSERT INTO workspacemember (id, workspace_id, user_id, role, joined_at)
                VALUES (:id, :workspace_id, :user_id, 'MEMBER', NOW())
            """).bindparams(
                id=str(uuid.uuid4()),
                workspace_id=workspace_id,
                user_id=user_id
            ))
            session.commit()
            print("✅ User added to workspace as MEMBER")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        session.rollback()
