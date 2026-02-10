"""
Authentication API endpoints for user registration and sign-in.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from ..database import get_session
from ..schemas.auth_schemas import UserCreate, UserSignIn, UserResponse, TokenResponse
from ..services.user_service import UserService
from ..utils.security import create_access_token
from ..middleware.auth import get_current_user
from ..models.user import User


router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserCreate,
    session: Session = Depends(get_session)
):
    """
    Register a new user account.
    
    - **email**: Valid email address (must be unique)
    - **password**: Minimum 8 characters, must contain at least one letter and one number
    
    Returns the created user information (excluding password).
    """
    user = UserService.create_user(session, user_data)
    return user


@router.post("/signin", response_model=TokenResponse)
async def signin(
    credentials: UserSignIn,
    session: Session = Depends(get_session)
):
    """
    Sign in with email and password to receive a JWT access token.
    
    - **email**: Registered email address
    - **password**: User password
    
    Returns a JWT token that should be included in the Authorization header
    for subsequent requests as: `Authorization: Bearer <token>`
    """
    user = UserService.authenticate_user(session, credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create JWT token with user ID and email
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email}
    )
    
    # Return token with user info
    return TokenResponse(
        access_token=access_token,
        user={
            "id": str(user.id),
            "email": user.email,
            "created_at": user.created_at.isoformat()
        }
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user information.
    
    Requires valid JWT token in Authorization header.
    Returns the current user's profile information.
    """
    return current_user
