"""Test task creation to debug 500 error"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from src.database import engine, get_session
from src.services.task_service import TaskService
from src.schemas.task_schemas import TaskCreate
from uuid import UUID
from sqlmodel import Session

# Test user ID from the error logs
user_id = UUID("ed00b61f-cdef-48bf-a49d-39116378cccc")

# Create a test task
task_data = TaskCreate(
    title="Test Task",
    description="Testing task creation"
)

try:
    with Session(engine) as session:
        task = TaskService.create_task(session, user_id, task_data)
        print(f"✅ Task created successfully: {task.id}")
        print(f"   Title: {task.title}")
        print(f"   User ID: {task.user_id}")
except Exception as e:
    print(f"❌ Error creating task: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
