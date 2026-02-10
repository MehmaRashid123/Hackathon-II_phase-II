"""
User service for authentication and user management business logic.
"""
from sqlmodel import Session, select
from typing import Optional
from datetime import datetime
from ..models.user import User
from ..schemas.auth_schemas import UserCreate
from ..utils.security import hash_password, verify_password
from fastapi import HTTPException, status


class UserService:
    """Service class for user-related operations."""
    
    @staticmethod
    def create_user(session: Session, user_data: UserCreate) -> User:
        """
        Create a new user with hashed password.
        
        Args:
            session: Database session
            user_data: User creation data
            
        Returns:
            Created user object
            
        Raises:
            HTTPException: If email already exists
        """
        # Check if email already exists
        statement = select(User).where(User.email == user_data.email)
        existing_user = session.exec(statement).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password
        hashed_password = hash_password(user_data.password)
        
        # Create user
        user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        session.add(user)
        session.commit()
        session.refresh(user)
        
        return user
    
    @staticmethod
    def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user by email and password.
        
        Args:
            session: Database session
            email: User email
            password: Plain text password
            
        Returns:
            User object if authentication successful, None otherwise
        """
        # Find user by email
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        
        if not user:
            return None
        
        # Verify password
        if not verify_password(password, user.hashed_password):
            return None
        
        return user
    
    @staticmethod
    def get_user_by_email(session: Session, email: str) -> Optional[User]:
        """
        Get user by email address.
        
        Args:
            session: Database session
            email: User email
            
        Returns:
            User object if found, None otherwise
        """
        statement = select(User).where(User.email == email)
        return session.exec(statement).first()
