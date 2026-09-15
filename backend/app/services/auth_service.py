from fastapi import HTTPException, status
from app.repositories import user_repo
from app.core import security
from typing import Dict, Any

async def register_user(email: str, username: str, password: str, full_name: str) -> Dict[str, Any]:
    if await user_repo.find_by_email(email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    if await user_repo.find_by_username(username):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    
    hashed_password = security.hash_password(password)
    user = await user_repo.create_user(email, username, hashed_password, full_name)
    
    user_id = str(user.get("id") or user.get("_id"))
    tokens = security.create_token_pair(user_id)
    
    return {"tokens": tokens, "user": user}

async def authenticate_user(email: str, password: str) -> Dict[str, Any]:
    user = await user_repo.find_by_email(email)
    
    if not user or not security.verify_password(password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    user_id = str(user.get("id") or user.get("_id"))
    tokens = security.create_token_pair(user_id)
    
    return {"tokens": tokens, "user": user}

async def refresh_tokens(refresh_token_str: str) -> Dict[str, str]:
    payload = security.decode_token(refresh_token_str)
    
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing subject")
        
    tokens = security.create_token_pair(user_id)
    return tokens

async def get_user_profile(user_id: str) -> Dict[str, Any]:
    user = await user_repo.find_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    if "hashed_password" in user:
        del user["hashed_password"]
        
    return user
