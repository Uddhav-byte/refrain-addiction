from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse, RefreshRequest
from app.services import auth_service
from app.core.dependencies import get_current_user
from pydantic import BaseModel
from typing import Optional

class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None

router = APIRouter(prefix='/api/v1/auth', tags=['Authentication'])

@router.post('/register', response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest):
    return await auth_service.register_user(request)

@router.post('/login', response_model=TokenResponse)
async def login(request: LoginRequest):
    return await auth_service.authenticate_user(request)

@router.post('/refresh', response_model=TokenResponse)
async def refresh(request: RefreshRequest):
    return await auth_service.refresh_tokens(request)

@router.get('/me', response_model=UserResponse)
@router.get('/profile', response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return await auth_service.get_user_profile(current_user['id'])

@router.put('/profile', response_model=UserResponse)
@router.patch('/profile', response_model=UserResponse)
async def update_profile(request: UpdateProfileRequest, current_user: dict = Depends(get_current_user)):
    user = await auth_service.get_user_profile(current_user['id'])
    return user
