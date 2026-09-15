from typing import Dict, Any, List
from app.repositories import urge_repo, user_repo
from app.services.analytics_service import calculate_streak

async def log_urge(user_id: str, urge_data: Dict[str, Any]) -> Dict[str, Any]:
    urge_data["user_id"] = user_id
    log = await urge_repo.create_urge_log(urge_data)
    
    if urge_data.get("resisted", False):
        current_streak = await calculate_streak(user_id)
        await user_repo.update_streak(user_id, current_streak)
    else:
        # Relapse resets streak
        await user_repo.update_streak(user_id, 0)
        
    return log

async def get_urge_logs(user_id: str, skip: int = 0, limit: int = 50) -> List[Dict[str, Any]]:
    return await urge_repo.get_by_user(user_id, skip=skip, limit=limit)

async def get_urge_trends(user_id: str, period: str) -> Dict[str, Any]:
    return await urge_repo.get_trends(user_id, period)
