from fastapi import APIRouter, Depends, Query, HTTPException, status
from typing import Any
from app.schemas.analytics import DashboardResponse, MoodTrendResponse, MoodLogRequest, TriggerHeatmapResponse
from app.services import analytics_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix='/api/v1/analytics', tags=['Analytics'])

@router.get('/dashboard', response_model=DashboardResponse)
async def get_dashboard(current_user: dict = Depends(get_current_user)):
    return await analytics_service.get_dashboard(current_user['id'])

@router.post('/mood', status_code=status.HTTP_201_CREATED)
async def log_mood(request: MoodLogRequest, current_user: dict = Depends(get_current_user)):
    return await analytics_service.log_mood(current_user['id'], request)

@router.get('/mood-trends', response_model=MoodTrendResponse)
@router.get('/mood/trends', response_model=MoodTrendResponse)
async def get_mood_trends(
    period: str = Query('30d'), 
    current_user: dict = Depends(get_current_user)
):
    normalized_period = f"{period}d" if period.isdigit() else period
    if normalized_period not in ['7d', '30d', '90d']:
        normalized_period = '30d'
    return await analytics_service.get_mood_trends(current_user['id'], normalized_period)

@router.get('/trigger-heatmap', response_model=TriggerHeatmapResponse)
@router.get('/triggers/heatmap', response_model=TriggerHeatmapResponse)
async def get_trigger_heatmap(current_user: dict = Depends(get_current_user)):
    return await analytics_service.get_trigger_heatmap(current_user['id'])
