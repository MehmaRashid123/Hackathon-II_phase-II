"""
Migrate old tasks to workspace
Assigns all tasks without workspace_id to user's first workspace
"""
from src.database import engine
from sqlmodel import Session, select, text
from src.models.task import Task
from src.models.workspace import Workspace
from src.models.user import User

with Session(engine) as session:
    # Get all tasks without workspace
    result = session.exec(text("SELECT id, created_by FROM tasks WHERE workspace_id IS NULL"))
    tasks_without_workspace = result.all()
    
    print(f"Found {len(tasks_without_workspace)} tasks without workspace")
    
    if not tasks_without_workspace:
        print("✅ All tasks already have workspaces!")
        exit(0)
    
    # Group tasks by user
    user_tasks = {}
    for task_id, user_id in tasks_without_workspace:
        if user_id not in user_tasks:
            user_tasks[user_id] = []
        user_tasks[user_id].append(task_id)
    
    # For each user, assign their tasks to their first workspace
    updated_count = 0
    for user_id, task_ids in user_tasks.items():
        # Get user's first workspace
        workspace = session.exec(
            select(Workspace)
            .where(Workspace.created_by == user_id)
            .limit(1)
        ).first()
        
        if not workspace:
            print(f"⚠️  User {user_id} has no workspace, skipping {len(task_ids)} tasks")
            continue
        
        # Update all tasks for this user
        for task_id in task_ids:
            session.exec(
                text(f"UPDATE tasks SET workspace_id = '{workspace.id}' WHERE id = '{task_id}'")
            )
            updated_count += 1
        
        print(f"✅ Assigned {len(task_ids)} tasks to workspace '{workspace.name}' for user {user_id}")
    
    session.commit()
    print(f"\n✅ Migration complete! Updated {updated_count} tasks")
