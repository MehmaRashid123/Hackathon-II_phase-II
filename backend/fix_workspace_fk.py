"""
Fix workspace foreign key to point to correct table
"""
from src.database import engine
from sqlmodel import Session, text

with Session(engine) as session:
    try:
        # Drop the old foreign key constraint
        print("Dropping old foreign key constraint...")
        session.exec(text("""
            ALTER TABLE tasks 
            DROP CONSTRAINT IF EXISTS tasks_workspace_id_fkey
        """))
        
        # Add new foreign key constraint pointing to workspace table
        print("Adding new foreign key constraint...")
        session.exec(text("""
            ALTER TABLE tasks 
            ADD CONSTRAINT tasks_workspace_id_fkey 
            FOREIGN KEY (workspace_id) REFERENCES workspace(id)
        """))
        
        session.commit()
        print("✅ Foreign key constraint updated successfully")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        session.rollback()
