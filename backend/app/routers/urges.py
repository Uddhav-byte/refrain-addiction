from fastapi import APIRouter, Depends, Query, status
from typing import List
from app.schemas.urge import UrgeLogRequest, UrgeLogResponse, UrgeTrendResponse
from app.services import urge_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix='/api/v1/urges', tags=['Urge Logs'])

@router.post('/', response_model=UrgeLogResponse, status_code=status.HTTP_201_CREATED)
async def log_urge(request: UrgeLogRequest, current_user: dict = Depends(get_current_user)):
    return await urge_service.log_urge(current_user['id'], request)

@router.get('/', response_model=List[UrgeLogResponse])
async def list_urges(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    return await urge_service.get_urge_logs(current_user['id'], skip=skip, limit=limit)

@router.get('/trends', response_model=UrgeTrendResponse)
async def get_urge_trends(
    period: str = Query('30d', pattern="^(7d|30d|90d)$"),
    current_user: dict = Depends(get_current_user)
):
    return await urge_service.get_urge_trends(current_user['id'], period)
