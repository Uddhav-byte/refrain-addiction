from datetime import datetime
from bson import ObjectId
from app.core.database import get_database

class AnalyticsRepository:
    @staticmethod
    def _format_doc(doc: dict | None) -> dict | None:
        if doc:
            doc["id"] = str(doc.pop("_id"))
        return doc

    @classmethod
    async def upsert_daily_snapshot(cls, user_id: str, date: str, data: dict) -> dict:
        db = await get_database()
        await db.analytics_snapshots.update_one(
            {"user_id": user_id, "date": date},
            {"$set": data},
            upsert=True
        )
        doc = await db.analytics_snapshots.find_one({"user_id": user_id, "date": date})
        return cls._format_doc(doc)

    @classmethod
    async def get_snapshot(cls, user_id: str, date: str) -> dict | None:
        db = await get_database()
        doc = await db.analytics_snapshots.find_one({"user_id": user_id, "date": date})
        return cls._format_doc(doc)

    @classmethod
    async def get_mood_trends(cls, user_id: str, days: int) -> list[dict]:
        db = await get_database()
        cursor = db.analytics_snapshots.find(
            {"user_id": user_id},
            {"mood_entries": 1, "date": 1}
        ).sort("date", -1).limit(days)
        
        docs = [cls._format_doc(doc) async for doc in cursor]
        docs.reverse()
        return docs

    @classmethod
    async def get_trigger_heatmap(cls, user_id: str, days: int = 30) -> list[dict]:
        db = await get_database()
        from datetime import timedelta
        start_date = datetime.utcnow() - timedelta(days=days)
        pipeline = [
            {"$match": {"user_id": user_id, "created_at": {"$gte": start_date}}},
            {
                "$project": {
                    "day_of_week": {"$dayOfWeek": "$created_at"},
                    "hour": {"$hour": "$created_at"}
                }
            },
            {
                "$group": {
                    "_id": {"day": "$day_of_week", "hour": "$hour"},
                    "count": {"$sum": 1}
                }
            },
            {
                "$project": {
                    "day_of_week": "$_id.day",
                    "hour": "$_id.hour",
                    "count": 1,
                    "_id": 0
                }
            }
        ]
        cursor = db.urge_logs.aggregate(pipeline)
        return [doc async for doc in cursor]

    @classmethod
    async def add_mood_entry(cls, user_id: str, date: str, entry: dict) -> None:
        db = await get_database()
        await db.analytics_snapshots.update_one(
            {"user_id": user_id, "date": date},
            {"$push": {"mood_entries": entry}},
            upsert=True
        )
