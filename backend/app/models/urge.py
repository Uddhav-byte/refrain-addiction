from datetime import datetime
from typing import Optional, List
from pydantic import Field

from app.models.user import MongoBaseModel

class UrgeLogDocument(MongoBaseModel):
    user_id: str
    intensity: int = Field(ge=1, le=10)
    triggers: List[str]
    emotions: List[str]
    coping_strategy_used: Optional[str] = None
    duration_minutes: Optional[int] = None
    notes: Optional[str] = None
    resisted: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)
