from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from fastapi import FastAPI
from app.core.config import settings


class Database:
    """Async MongoDB connection manager using Motor."""

    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None


db_instance = Database()


async def init_indexes(db: AsyncIOMotorDatabase) -> None:
    """Create MongoDB indexes on startup."""
    await db.users.create_index("email", unique=True)
    await db.users.create_index("username", unique=True)
    await db.assessments.create_index([("user_id", 1), ("created_at", -1)])
    await db.urge_logs.create_index([("user_id", 1), ("created_at", -1)])
    await db.analytics.create_index([("user_id", 1), ("date", -1)])
    await db.chat_messages.create_index([("room_id", 1), ("created_at", -1)])
    await db.chat_messages.create_index("room_id")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan managing database connections."""
    db_instance.client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        maxPoolSize=settings.MONGO_MAX_POOL_SIZE,
        minPoolSize=settings.MONGO_MIN_POOL_SIZE,
        maxIdleTimeMS=45000,
        serverSelectionTimeoutMS=5000,
    )
    db_instance.db = db_instance.client[settings.MONGODB_DB_NAME]

    try:
        await init_indexes(db_instance.db)
    except Exception as e:
        print(f"Warning: Could not create indexes: {e}")

    yield

    if db_instance.client:
        db_instance.client.close()


def get_database() -> AsyncIOMotorDatabase:
    """Dependency to get the database instance."""
    if db_instance.db is None:
        raise RuntimeError("Database is not initialized")
    return db_instance.db
