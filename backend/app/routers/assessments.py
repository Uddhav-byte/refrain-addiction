from fastapi import APIRouter, Depends, HTTPException
from typing import List, Any
from app.schemas.assessment import AssessmentSubmitRequest, AssessmentResponse, InsightResponse
from app.services import assessment_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix='/api/v1/assessments', tags=['Assessments'])

@router.get('/questions', response_model=List[Any])
async def get_questions():
    return await assessment_service.get_questions()

@router.post('', response_model=AssessmentResponse)
@router.post('/', response_model=AssessmentResponse)
async def submit_assessment(request: AssessmentSubmitRequest, current_user: dict = Depends(get_current_user)):
    return await assessment_service.submit_assessment(current_user['id'], request)

@router.get('/latest', response_model=AssessmentResponse)
async def get_latest_assessment(current_user: dict = Depends(get_current_user)):
    return await assessment_service.get_latest_assessment(current_user['id'])

@router.get('/insights', response_model=InsightResponse)
async def get_insights(current_user: dict = Depends(get_current_user)):
    return await assessment_service.get_insights(current_user['id'])
