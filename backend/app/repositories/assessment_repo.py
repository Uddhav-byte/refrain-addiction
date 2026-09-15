from bson import ObjectId
from app.core.database import get_database

class AssessmentRepository:
    @staticmethod
    def _format_doc(doc: dict | None) -> dict | None:
        if doc:
            doc["id"] = str(doc.pop("_id"))
        return doc

    @classmethod
    async def create_assessment(cls, assessment_data: dict) -> dict:
        db = await get_database()
        result = await db.assessments.insert_one(assessment_data)
        created = await db.assessments.find_one({"_id": result.inserted_id})
        return cls._format_doc(created)

    @classmethod
    async def get_latest_by_user(cls, user_id: str) -> dict | None:
        db = await get_database()
        doc = await db.assessments.find_one(
            {"user_id": user_id},
            sort=[("created_at", -1)]
        )
        return cls._format_doc(doc)

    @classmethod
    async def get_all_by_user(cls, user_id: str, limit: int = 10) -> list[dict]:
        db = await get_database()
        cursor = db.assessments.find({"user_id": user_id}).sort("created_at", -1).limit(limit)
        return [cls._format_doc(doc) async for doc in cursor]

    @classmethod
    async def update_assessment(cls, assessment_id: str, update_data: dict) -> dict | None:
        db = await get_database()
        if not ObjectId.is_valid(assessment_id):
            return None
        await db.assessments.update_one(
            {"_id": ObjectId(assessment_id)},
            {"$set": update_data}
        )
        doc = await db.assessments.find_one({"_id": ObjectId(assessment_id)})
        return cls._format_doc(doc)
