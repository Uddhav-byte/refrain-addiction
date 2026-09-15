from datetime import datetime, timedelta
from bson import ObjectId
from app.core.database import get_database

class UrgeRepository:
    @staticmethod
    def _format_doc(doc: dict | None) -> dict | None:
        if doc:
            doc["id"] = str(doc.pop("_id"))
        return doc

    @classmethod
    async def create_urge_log(cls, log_data: dict) -> dict:
        db = await get_database()
        result = await db.urge_logs.insert_one(log_data)
        created = await db.urge_logs.find_one({"_id": result.inserted_id})
        return cls._format_doc(created)

    @classmethod
    async def get_by_user(cls, user_id: str, skip: int = 0, limit: int = 20) -> list[dict]:
        db = await get_database()
        cursor = db.urge_logs.find({"user_id": user_id}).sort("created_at", -1).skip(skip).limit(limit)
        return [cls._format_doc(doc) async for doc in cursor]

    @classmethod
    async def get_trends(cls, user_id: str, days: int = 30) -> list[dict]:
        db = await get_database()
        start_date = datetime.utcnow() - timedelta(days=days)
        pipeline = [
            {"$match": {"user_id": user_id, "created_at": {"$gte": start_date}}},
            {
                "$group": {
                    "_id": {
                        "$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}
                    },
                    "count": {"$sum": 1},
                    "avg_intensity": {"$avg": "$intensity"},
                    "resisted_count": {
                        "$sum": {"$cond": [{"$eq": ["$resisted", True]}, 1, 0]}
                    }
                }
            },
            {
                "$project": {
                    "date": "$_id",
                    "count": 1,
                    "avg_intensity": 1,
                    "resisted_percentage": {
                        "$cond": [
                            {"$gt": ["$count", 0]},
                            {"$multiply": [{"$divide": ["$resisted_count", "$count"]}, 100]},
                            0
                        ]
                    },
                    "_id": 0
                }
            },
            {"$sort": {"date": 1}}
        ]
        cursor = db.urge_logs.aggregate(pipeline)
        return [doc async for doc in cursor]

    @classmethod
    async def get_count_by_user(cls, user_id: str) -> int:
        db = await get_database()
        return await db.urge_logs.count_documents({"user_id": user_id})

    @classmethod
    async def get_resisted_count(cls, user_id: str) -> int:
        db = await get_database()
        return await db.urge_logs.count_documents({"user_id": user_id, "resisted": True})
