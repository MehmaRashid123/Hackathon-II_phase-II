"""
Check both workspace tables
"""
from src.database import engine
from sqlmodel import Session, text

with Session(engine) as session:
    try:
        # Check workspace table
        result = session.exec(text("SELECT COUNT(*) FROM workspace"))
        workspace_count = result.one()[0]
        print(f"workspace table: {workspace_count} rows")
        
        # Check workspaces table
        result = session.exec(text("SELECT COUNT(*) FROM workspaces"))
        workspaces_count = result.one()[0]
        print(f"workspaces table: {workspaces_count} rows")
        
        if workspaces_count > 0:
            result = session.exec(text("SELECT id, name FROM workspaces LIMIT 5"))
            print("\nSample from workspaces table:")
            for row in result:
                print(f"  {row[0]}: {row[1]}")
                
    except Exception as e:
        print(f"❌ Error: {e}")
