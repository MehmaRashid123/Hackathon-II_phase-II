"""Test task database operations"""
from src.database import engine
from sqlmodel import text, Session

# Test database connection and task count
with Session(engine) as session:
    # Count total tasks
    result = session.exec(text("SELECT COUNT(*) FROM tasks"))
    task_count = result.scalar()
    print(f"✅ Total tasks in database: {task_count}")
    
    # Get sample tasks
    result = session.exec(text("SELECT id, title, status, workspace_id FROM tasks LIMIT 5"))
    tasks = result.all()
    
    if tasks:
        print("\n📋 Sample tasks:")
        for task in tasks:
            print(f"  - ID: {task[0]}, Title: {task[1]}, Status: {task[2]}, Workspace: {task[3]}")
    else:
        print("\n⚠️  No tasks found in database")
    
    # Check workspace count
    result = session.exec(text("SELECT COUNT(*) FROM workspace"))
    workspace_count = result.scalar()
    print(f"\n✅ Total workspaces: {workspace_count}")
    
    # Check users
    result = session.exec(text("SELECT COUNT(*) FROM users"))
    user_count = result.scalar()
    print(f"✅ Total users: {user_count}")
