from datetime import datetime
from pydantic import BaseModel, Field

class ChatMessageRequest(BaseModel):
    content: str = Field(max_length=1000)

class ChatMessageResponse(BaseModel):
    id: str
    room_id: str
    user_id: str
    username: str
    content: str
    message_type: str
    created_at: datetime

class ChatRoomResponse(BaseModel):
    room_id: str
    name: str
    description: str
    room_type: str
    online_count: int = 0
    is_active: bool
