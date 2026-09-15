from datetime import datetime
from pydantic import Field

from app.models.user import MongoBaseModel

class ChatMessage(MongoBaseModel):
    room_id: str
    user_id: str
    username: str
    content: str
    message_type: str = 'text'  # text/system/urge_checkin
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ChatRoom(MongoBaseModel):
    room_id: str
    name: str
    description: str
    room_type: str  # general/support/emergency
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
