from datetime import datetime
from bson import ObjectId
from app.core.database import get_database

class UserRepository:
    @staticmethod
    def _format_doc(doc: dict | None) -> dict | None:
        if doc:
            doc["id"] = str(doc.pop("_id"))
        return doc

    @classmethod
    async def create_user(cls, user_data: dict) -> dict:
        db = await get_database()
        result = await db.users.insert_one(user_data)
        created_user = await db.users.find_one({"_id": result.inserted_id})
        return cls._format_doc(created_user)

    @classmethod
    async def find_by_email(cls, email: str) -> dict | None:
        db = await get_database()
        user = await db.users.find_one({"email": email})
        return cls._format_doc(user)

    @classmethod
    async def find_by_username(cls, username: str) -> dict | None:
        db = await get_database()
        user = await db.users.find_one({"username": username})
        return cls._format_doc(user)

    @classmethod
    async def find_by_id(cls, user_id: str) -> dict | None:
        db = await get_database()
        if not ObjectId.is_valid(user_id):
            return None
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        return cls._format_doc(user)

    @classmethod
    async def update_user(cls, user_id: str, update_data: dict) -> dict | None:
        db = await get_database()
        if not ObjectId.is_valid(user_id):
            return None
        await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        return cls._format_doc(user)

    @classmethod
    async def update_streak(cls, user_id: str, streak_days: int, streak_start: datetime, longest: int) -> None:
        db = await get_database()
        if not ObjectId.is_valid(user_id):
            return
        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {
                "streak_days": streak_days,
                "streak_start_date": streak_start,
                "longest_streak": longest
            }}
        )
