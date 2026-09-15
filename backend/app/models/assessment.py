from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

from app.models.user import MongoBaseModel

class QuestionAnswer(BaseModel):
    question_id: str
    question_text: str
    answer_value: int = Field(ge=0, le=10)
    answer_text: Optional[str] = None
    category: str  # 'triggers', 'severity', 'emotional', 'relapse_risk'

class BehavioralSignalVector(BaseModel):
    dopamine_sensitivity: float = Field(ge=0.0, le=100.0)
    stress_rating: float = Field(ge=0.0, le=100.0)
    trigger_frequency: float
    relapse_risk_index: float = Field(ge=0.0, le=100.0)
    computed_at: datetime = Field(default_factory=datetime.utcnow)

class DailyInsight(BaseModel):
    insight_id: str
    category: str
    title: str
    description: str
    priority: int = Field(ge=1, le=5)
    completed: bool = False

class AssessmentDocument(MongoBaseModel):
    user_id: str
    answers: List[QuestionAnswer]
    signal_vector: BehavioralSignalVector
    daily_insights: List[DailyInsight]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    version: int = 1
