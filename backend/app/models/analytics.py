from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field

from app.models.user import MongoBaseModel

class MoodEntry(BaseModel):
    mood_score: int = Field(ge=1, le=10)
    craving_score: int = Field(ge=1, le=10)
    energy_level: int = Field(ge=1, le=10)
    notes: Optional[str] = None
    recorded_at: datetime = Field(default_factory=datetime.utcnow)

class MilestoneBadge(BaseModel):
    badge_id: str
    name: str
    description: str
    icon: str
    days_required: int
    earned: bool = False
    earned_at: Optional[datetime] = None

class AnalyticsSnapshot(MongoBaseModel):
    user_id: str
    date: date
    mood_entries: List[MoodEntry] = Field(default_factory=list)
    average_mood: Optional[float] = None
    average_craving: Optional[float] = None
    urge_count: int = 0
    resisted_count: int = 0
    milestones: List[MilestoneBadge] = Field(default_factory=list)
