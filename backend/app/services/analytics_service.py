from fastapi import HTTPException, status
from typing import Dict, Any, List
from datetime import datetime, timedelta
from app.repositories import analytics_repo, urge_repo, assessment_repo, user_repo

MILESTONE_DEFINITIONS = [
    {"badge_id": "first_step", "name": "First Step", "description": "1 day clean", "icon": "🌱", "days_required": 1},
    {"badge_id": "getting_started", "name": "Getting Started", "description": "3 days clean", "icon": "🌿", "days_required": 3},
    {"badge_id": "one_week", "name": "One Week Strong", "description": "7 days clean", "icon": "💪", "days_required": 7},
    {"badge_id": "two_weeks", "name": "Two Weeks", "description": "14 days clean", "icon": "⭐", "days_required": 14},
    {"badge_id": "monthly_warrior", "name": "Monthly Warrior", "description": "30 days clean", "icon": "🛡️", "days_required": 30},
    {"badge_id": "two_months", "name": "Two Months", "description": "60 days clean", "icon": "🔥", "days_required": 60},
    {"badge_id": "quarter_champion", "name": "Quarter Champion", "description": "90 days clean", "icon": "👑", "days_required": 90},
    {"badge_id": "half_year", "name": "Half Year Hero", "description": "180 days clean", "icon": "🌟", "days_required": 180},
    {"badge_id": "one_year", "name": "One Year Legend", "description": "365 days clean", "icon": "🏆", "days_required": 365}
]

async def calculate_streak(user_id: str) -> int:
    # This is a simplified calculation. Real implementation might need to check continuous days.
    # We will fetch latest unresisted urge and calculate days since then.
    user = await user_repo.find_by_id(user_id)
    if not user:
        return 0
        
    created_at = user.get("created_at", datetime.utcnow())
    if isinstance(created_at, str):
        created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
        
    # Get last non-resisted urge (relapse)
    logs = await urge_repo.get_by_user(user_id, skip=0, limit=1000)
    
    last_relapse_time = created_at
    for log in logs:
        if not log.get("resisted", True):
            log_time = log.get("created_at", datetime.utcnow())
            if isinstance(log_time, str):
                log_time = datetime.fromisoformat(log_time.replace("Z", "+00:00"))
            if log_time > last_relapse_time:
                last_relapse_time = log_time
                
    delta = datetime.utcnow() - last_relapse_time
    return max(0, delta.days)

async def check_and_update_milestones(user_id: str, streak_days: int) -> List[Dict[str, Any]]:
    earned_milestones = []
    for milestone in MILESTONE_DEFINITIONS:
        if streak_days >= milestone["days_required"]:
            earned_milestones.append(milestone)
    return earned_milestones

async def get_dashboard(user_id: str) -> Dict[str, Any]:
    streak = await calculate_streak(user_id)
    milestones = await check_and_update_milestones(user_id, streak)
    total_resisted = await urge_repo.get_resisted_count(user_id)
    
    user = await user_repo.find_by_id(user_id)
    created_at = user.get("created_at", datetime.utcnow()) if user else datetime.utcnow()
    if isinstance(created_at, str):
        created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
    days_tracked = max(1, (datetime.utcnow() - created_at).days)
    
    assessment = await assessment_repo.get_latest_by_user(user_id)
    risk_level = "Unknown"
    if assessment and assessment.get("signal_vector"):
        rri = assessment["signal_vector"].get("relapse_risk_index", 0)
        if rri > 70:
            risk_level = "High"
        elif rri > 40:
            risk_level = "Moderate"
        else:
            risk_level = "Low"
            
    return {
        "streak_days": streak,
        "milestones": milestones,
        "total_urges_resisted": total_resisted,
        "days_tracked": days_tracked,
        "risk_level": risk_level
    }

async def log_mood(user_id: str, mood_score: int, craving_score: int, energy_level: int, notes: str) -> Dict[str, Any]:
    entry = {
        "mood_score": mood_score,
        "craving_score": craving_score,
        "energy_level": energy_level,
        "notes": notes,
        "timestamp": datetime.utcnow()
    }
    await analytics_repo.add_mood_entry(user_id, entry)
    await analytics_repo.upsert_daily_snapshot(user_id)
    return entry

async def get_mood_trends(user_id: str, period: str) -> Dict[str, Any]:
    return await analytics_repo.get_mood_trends(user_id, period)

async def get_trigger_heatmap(user_id: str, days: int) -> Dict[str, Any]:
    return await analytics_repo.get_trigger_heatmap(user_id, days)
