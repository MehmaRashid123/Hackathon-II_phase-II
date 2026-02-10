"""
Authentication middleware for JWT token verification.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from typing import Optional
from uuid import UUID
from ..database import get_session
from ..models.user import User
from ..utils.security import decode_access_token


# HTTP Bearer security scheme
security = HTTPBearer()


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> UUID:
    """
    Extract and verify JWT token, return user ID.
    
    Args:
        credentials: HTTP Bearer token from Authorization header
        
    Returns:
        User ID from token
        
    Raises:
        HTTPException: If token is invalid, expired, or missing
    """
    token = credentials.credentials
    
    # Decode and verify token
    payload = decode_access_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Extract user_id from 'sub' claim
    user_id_str: Optional[str] = payload.get("sub")
    
    if user_id_str is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        user_id = UUID(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID in token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user_id


async def get_current_user(
    user_id: UUID = Depends(get_current_user_id),
    session: Session = Depends(get_session)
) -> User:
    """
    Get the current authenticated user from database.
    
    Args:
        user_id: User ID from JWT token
        session: Database session
        
    Returns:
        User object
        
    Raises:
        HTTPException: If user not found
    """
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


async def validate_user_id(
    path_user_id: UUID,
    token_user_id: UUID = Depends(get_current_user_id)
) -> UUID:
    """
    Validate that the user_id in the URL path matches the JWT token user_id.
    
    Args:
        path_user_id: User ID from URL path parameter
        token_user_id: User ID from JWT token
        
    Returns:
        Validated user ID
        
    Raises:
        HTTPException: If user IDs don't match (403 Forbidden)
    """
    if path_user_id != token_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's resources"
        )
    
    return token_user_id
