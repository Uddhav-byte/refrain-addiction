from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from app.models.assessment import BehavioralSignalVector, DailyInsight

class AnswerDict(BaseModel):
    question_id: str
    answer_value: int
    answer_text: Optional[str] = None

class AssessmentSubmitRequest(BaseModel):
    answers: List[AnswerDict]

class AssessmentResponse(BaseModel):
    id: str
    signal_vector: BehavioralSignalVector
    daily_insights: List[DailyInsight]
    created_at: datetime

class InsightResponse(BaseModel):
    insights: List[DailyInsight]
    signal_vector: BehavioralSignalVector
