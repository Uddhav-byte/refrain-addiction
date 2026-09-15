from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse, RefreshRequest
from app.services import auth_service
from app.core.dependencies import get_current_user

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
async def get_me(current_user: dict = Depends(get_current_user)):
    return await auth_service.get_user_profile(current_user['id'])
