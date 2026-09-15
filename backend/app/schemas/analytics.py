from typing import List, Optional
from pydantic import BaseModel, Field

from app.models.analytics import MilestoneBadge

class DashboardResponse(BaseModel):
    streak_days: int
    longest_streak: int
    total_urges_resisted: int
    total_days_tracked: int
    current_milestones: List[MilestoneBadge]
    relapse_risk_level: str  # low/medium/high

class MoodDataPoint(BaseModel):
    date: str
    mood: float
    craving: float
    energy: float

class MoodTrendResponse(BaseModel):
    period: str
    data_points: List[MoodDataPoint]

class MoodLogRequest(BaseModel):
    mood_score: int = Field(ge=1, le=10)
    craving_score: int = Field(ge=1, le=10)
    energy_level: int = Field(ge=1, le=10)
    notes: Optional[str] = None

class HeatmapDataPoint(BaseModel):
    day_of_week: int = Field(ge=0, le=6)
    hour: int = Field(ge=0, le=23)
    count: int

class TriggerHeatmapResponse(BaseModel):
    data: List[HeatmapDataPoint]
