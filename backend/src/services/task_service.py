"""
Task service for task management business logic with user isolation.
"""
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from ..models.task import Task
from ..schemas.task_schemas import TaskCreate, TaskUpdate
from fastapi import HTTPException, status


class TaskService:
    """Service class for task-related operations with user isolation."""
    
    @staticmethod
    def get_user_tasks(session: Session, user_id: UUID) -> List[Task]:
        """
        Get all tasks for a specific user, ordered by creation date (newest first).
        
        Args:
            session: Database session
            user_id: User ID to filter tasks
            
        Returns:
            List of tasks belonging to the user
        """
        statement = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
        tasks = session.exec(statement).all()
        return list(tasks)
    
    @staticmethod
    def create_task(session: Session, user_id: UUID, task_data: TaskCreate) -> Task:
        """
        Create a new task for a user.
        
        Args:
            session: Database session
            user_id: User ID who owns the task
            task_data: Task creation data
            
        Returns:
            Created task object
        """
        task = Task(
            title=task_data.title,
            description=task_data.description,
            is_completed=False,
            status=task_data.status or "TO_DO",
            user_id=user_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        session.add(task)
        session.commit()
        session.refresh(task)
        
        return task
    
    @staticmethod
    def get_task_by_id(session: Session, user_id: UUID, task_id: UUID) -> Task:
        """
        Get a specific task by ID, ensuring it belongs to the user.
        
        Args:
            session: Database session
            user_id: User ID to verify ownership
            task_id: Task ID to retrieve
            
        Returns:
            Task object
            
        Raises:
            HTTPException: If task not found or doesn't belong to user
        """
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = session.exec(statement).first()
        
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        return task
    
    @staticmethod
    def update_task(session: Session, user_id: UUID, task_id: UUID, update_data: TaskUpdate) -> Task:
        """
        Update a task's details.
        
        Args:
            session: Database session
            user_id: User ID to verify ownership
            task_id: Task ID to update
            update_data: Updated task data
            
        Returns:
            Updated task object
            
        Raises:
            HTTPException: If task not found or doesn't belong to user
        """
        task = TaskService.get_task_by_id(session, user_id, task_id)
        
        # Update only provided fields
        if update_data.title is not None:
            task.title = update_data.title
        if update_data.description is not None:
            task.description = update_data.description
        if update_data.status is not None:
            task.status = update_data.status
            # Auto-update is_completed based on status
            task.is_completed = (update_data.status == "DONE")
        
        task.updated_at = datetime.utcnow()
        
        session.add(task)
        session.commit()
        session.refresh(task)
        
        return task
    
    @staticmethod
    def delete_task(session: Session, user_id: UUID, task_id: UUID) -> None:
        """
        Delete a task.
        
        Args:
            session: Database session
            user_id: User ID to verify ownership
            task_id: Task ID to delete
            
        Raises:
            HTTPException: If task not found or doesn't belong to user
        """
        task = TaskService.get_task_by_id(session, user_id, task_id)
        
        session.delete(task)
        session.commit()
    
    @staticmethod
    def toggle_task_completion(session: Session, user_id: UUID, task_id: UUID) -> Task:
        """
        Toggle a task's completion status.
        
        Args:
            session: Database session
            user_id: User ID to verify ownership
            task_id: Task ID to toggle
            
        Returns:
            Updated task object
            
        Raises:
            HTTPException: If task not found or doesn't belong to user
        """
        task = TaskService.get_task_by_id(session, user_id, task_id)
        
        task.is_completed = not task.is_completed
        task.updated_at = datetime.utcnow()
        
        session.add(task)
        session.commit()
        session.refresh(task)
        
        return task
