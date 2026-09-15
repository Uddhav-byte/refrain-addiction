from datetime import datetime
from bson import ObjectId
from app.core.database import get_database

class ChatRepository:
    @staticmethod
    def _format_doc(doc: dict | None) -> dict | None:
        if doc:
            doc["id"] = str(doc.pop("_id"))
        return doc

    @classmethod
    async def save_message(cls, message_data: dict) -> dict:
        db = await get_database()
        result = await db.chat_messages.insert_one(message_data)
        created = await db.chat_messages.find_one({"_id": result.inserted_id})
        return cls._format_doc(created)

    @classmethod
    async def get_room_messages(cls, room_id: str, limit: int = 50, before: datetime | None = None) -> list[dict]:
        db = await get_database()
        query = {"room_id": room_id}
        if before:
            query["created_at"] = {"$lt": before}
            
        cursor = db.chat_messages.find(query).sort("created_at", -1).limit(limit)
        docs = [cls._format_doc(doc) async for doc in cursor]
        return docs

    @classmethod
    async def get_or_create_room(cls, room_id: str, name: str, description: str, room_type: str) -> dict:
        db = await get_database()
        room = await db.chat_rooms.find_one({"room_id": room_id})
        if room:
            return cls._format_doc(room)
            
        new_room = {
            "room_id": room_id,
            "name": name,
            "description": description,
            "room_type": room_type,
            "created_at": datetime.utcnow(),
            "is_active": True
        }
        result = await db.chat_rooms.insert_one(new_room)
        created = await db.chat_rooms.find_one({"_id": result.inserted_id})
        return cls._format_doc(created)

    @classmethod
    async def get_rooms(cls) -> list[dict]:
        db = await get_database()
        cursor = db.chat_rooms.find({"is_active": True})
        return [cls._format_doc(doc) async for doc in cursor]

    @classmethod
    async def get_room(cls, room_id: str) -> dict | None:
        db = await get_database()
        doc = await db.chat_rooms.find_one({"room_id": room_id})
        return cls._format_doc(doc)
