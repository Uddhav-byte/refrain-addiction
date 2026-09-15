from datetime import datetime
from typing import Optional, Annotated, Any
from pydantic import BaseModel, ConfigDict, EmailStr, Field, BeforeValidator

# Custom PyObjectId type for MongoDB ObjectIds
def validate_object_id(v: Any) -> str:
    if isinstance(v, str):
        return v
    return str(v)

PyObjectId = Annotated[str, BeforeValidator(validate_object_id)]

class MongoBaseModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

class UserDocument(MongoBaseModel):
    email: EmailStr
    username: str
    hashed_password: str
    full_name: str
    avatar_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    streak_days: int = 0
    streak_start_date: Optional[datetime] = None
    longest_streak: int = 0
