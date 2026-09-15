from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class UrgeLogRequest(BaseModel):
    intensity: int = Field(ge=1, le=10)
    triggers: List[str]
    emotions: List[str]
    coping_strategy_used: Optional[str] = None
    duration_minutes: Optional[int] = None
    notes: Optional[str] = None
    resisted: bool

class UrgeLogResponse(UrgeLogRequest):
    id: str
    created_at: datetime

class TrendDataPoint(BaseModel):
    date: str
    avg_intensity: float
    count: int
    resisted_percentage: float

class UrgeTrendResponse(BaseModel):
    period: str
    data_points: List[TrendDataPoint]
