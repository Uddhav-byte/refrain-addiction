from typing import Dict, Any, List
from fastapi import HTTPException, status
from app.repositories import chat_repo

DEFAULT_ROOMS = [
    {"id": "general", "name": "General Support", "description": "Open discussion"},
    {"id": "recovery", "name": "Recovery Circle", "description": "Share your journey"},
    {"id": "emergency", "name": "Crisis Support", "description": "Immediate help"}
]

async def save_message(room_id: str, user_id: str, username: str, content: str, message_type: str = "text") -> Dict[str, Any]:
    message_data = {
        "room_id": room_id,
        "user_id": user_id,
        "username": username,
        "content": content,
        "message_type": message_type
    }
    return await chat_repo.save_message(message_data)

async def get_room_messages(room_id: str, limit: int = 50, before: str = None) -> List[Dict[str, Any]]:
    return await chat_repo.get_room_messages(room_id, limit, before)

async def get_available_rooms() -> List[Dict[str, Any]]:
    rooms = await chat_repo.get_rooms()
    if not rooms:
        for default_room in DEFAULT_ROOMS:
            await chat_repo.get_or_create_room(
                default_room["id"], 
                default_room["name"], 
                default_room["description"]
            )
        rooms = await chat_repo.get_rooms()
    return rooms

async def get_room_info(room_id: str) -> Dict[str, Any]:
    room = await chat_repo.get_room(room_id)
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    return room
