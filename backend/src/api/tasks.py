"""
Task management API endpoints with user isolation.
"""
from fastapi import APIRouter, Depends, status, Path
from sqlmodel import Session
from typing import List
from uuid import UUID
from ..database import get_session
from ..schemas.task_schemas import TaskCreate, TaskUpdate, TaskResponse
from ..services.task_service import TaskService
from ..middleware.auth import get_current_user_id


router = APIRouter(prefix="/api", tags=["Tasks"])


async def validate_user_access(
    user_id: UUID = Path(..., description="User ID from URL"),
    token_user_id: UUID = Depends(get_current_user_id)
) -> UUID:
    """Validate that URL user_id matches token user_id."""
    from fastapi import HTTPException
    if user_id != token_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's resources"
        )
    return user_id


@router.get("/{user_id}/tasks", response_model=List[TaskResponse])
async def list_tasks(
    user_id: UUID = Depends(validate_user_access),
    session: Session = Depends(get_session)
):
    """
    Get all tasks for the authenticated user.
    
    Returns a list of all tasks belonging to the user, ordered by creation date (newest first).
    Requires valid JWT token matching the user_id in the URL.
    """
    tasks = TaskService.get_user_tasks(session, user_id)
    return tasks


@router.post("/{user_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    user_id: UUID = Depends(validate_user_access),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user.
    
    - **title**: Task title (1-500 characters, required)
    - **description**: Task description (0-5000 characters, optional)
    
    Returns the created task with auto-generated ID and timestamps.
    Requires valid JWT token matching the user_id in the URL.
    """
    task = TaskService.create_task(session, user_id, task_data)
    return task


@router.get("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: UUID,
    user_id: UUID = Depends(validate_user_access),
    session: Session = Depends(get_session)
):
    """
    Get details of a specific task.
    
    Returns the task details if it exists and belongs to the authenticated user.
    Requires valid JWT token matching the user_id in the URL.
    """
    task = TaskService.get_task_by_id(session, user_id, task_id)
    return task


@router.put("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: UUID,
    update_data: TaskUpdate,
    user_id: UUID = Depends(validate_user_access),
    session: Session = Depends(get_session)
):
    """
    Update a task's title and/or description.
    
    - **title**: Updated task title (optional)
    - **description**: Updated task description (optional)
    
    Returns the updated task.
    Requires valid JWT token matching the user_id in the URL.
    """
    task = TaskService.update_task(session, user_id, task_id, update_data)
    return task


@router.delete("/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: UUID,
    user_id: UUID = Depends(validate_user_access),
    session: Session = Depends(get_session)
):
    """
    Permanently delete a task.
    
    Removes the task from the database if it exists and belongs to the authenticated user.
    Returns 204 No Content on success.
    Requires valid JWT token matching the user_id in the URL.
    """
    TaskService.delete_task(session, user_id, task_id)
    return None


@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskResponse)
async def toggle_task_completion(
    task_id: UUID,
    user_id: UUID = Depends(validate_user_access),
    session: Session = Depends(get_session)
):
    """
    Toggle a task's completion status.
    
    Flips the is_completed boolean (true → false or false → true).
    Returns the updated task.
    Requires valid JWT token matching the user_id in the URL.
    """
    task = TaskService.toggle_task_completion(session, user_id, task_id)
    return task
