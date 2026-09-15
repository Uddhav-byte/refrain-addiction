from fastapi import HTTPException, status
from typing import Dict, Any, List
from datetime import datetime
from app.repositories import assessment_repo

ASSESSMENT_QUESTIONS = [
    {"id": "t1", "category": "triggers", "text": "How often do you encounter your primary trigger?"},
    {"id": "t2", "category": "triggers", "text": "How strong are environmental cues?"},
    {"id": "t3", "category": "triggers", "text": "Rate social pressure to use"},
    {"id": "t4", "category": "triggers", "text": "How often do you find yourself thinking about your triggers?"},
    
    {"id": "s1", "category": "severity", "text": "Current withdrawal severity"},
    {"id": "s2", "category": "severity", "text": "Physical dependency rating"},
    {"id": "s3", "category": "severity", "text": "Tolerance level"},
    {"id": "s4", "category": "severity", "text": "Impact on daily functioning"},
    
    {"id": "e1", "category": "emotional", "text": "Current stress level"},
    {"id": "e2", "category": "emotional", "text": "Anxiety frequency"},
    {"id": "e3", "category": "emotional", "text": "Emotional regulation ability"},
    {"id": "e4", "category": "emotional", "text": "Support network strength"},
    
    {"id": "r1", "category": "relapse_risk", "text": "Confidence in staying sober"},
    {"id": "r2", "category": "relapse_risk", "text": "Past relapse frequency"},
    {"id": "r3", "category": "relapse_risk", "text": "Access to support resources"},
    {"id": "r4", "category": "relapse_risk", "text": "Motivation to maintain recovery"}
]

def get_questions() -> List[Dict[str, str]]:
    return ASSESSMENT_QUESTIONS

def calculate_behavioral_signal_vector(answers: List[Dict[str, Any]]) -> Dict[str, float]:
    trigger_scores = []
    severity_scores = []
    emotional_scores = []
    
    question_map = {q["id"]: q["category"] for q in ASSESSMENT_QUESTIONS}
    
    for ans in answers:
        q_id = ans.get("question_id")
        score = ans.get("score", 0)  # Assume score 0-10
        category = question_map.get(q_id)
        
        if category == "triggers":
            trigger_scores.append(score)
        elif category == "severity":
            severity_scores.append(score)
        elif category == "emotional":
            emotional_scores.append(score)
            
    avg_trigger = sum(trigger_scores) / max(1, len(trigger_scores))
    avg_severity = sum(severity_scores) / max(1, len(severity_scores))
    avg_emotional = sum(emotional_scores) / max(1, len(emotional_scores))
    
    dopamine_sensitivity = min(100.0, ((avg_severity + avg_trigger) / 2.0) * 10.0)
    stress_rating = min(100.0, avg_emotional * 10.0)
    trigger_frequency = avg_trigger
    
    relapse_risk_index = (dopamine_sensitivity * 0.4) + (stress_rating * 0.35) + (trigger_frequency * 2.5)
    relapse_risk_index = min(100.0, max(0.0, relapse_risk_index))
    
    return {
        "dopamine_sensitivity": dopamine_sensitivity,
        "stress_rating": stress_rating,
        "trigger_frequency": trigger_frequency,
        "relapse_risk_index": relapse_risk_index
    }

def generate_daily_insights(signal_vector: Dict[str, float]) -> List[Dict[str, Any]]:
    insights = []
    
    if signal_vector.get("dopamine_sensitivity", 0) > 60:
        insights.append({
            "type": "dopamine",
            "message": "High dopamine sensitivity detected. Consider a dopamine detox and seeking alternative healthy rewards today."
        })
        
    if signal_vector.get("stress_rating", 0) > 60:
        insights.append({
            "type": "stress",
            "message": "Your stress levels are elevated. Prioritize mindfulness, deep breathing exercises, or journaling."
        })
        
    if signal_vector.get("trigger_frequency", 0) > 5:
        insights.append({
            "type": "triggers",
            "message": "You are experiencing frequent triggers. Focus on environment modification and avoidance strategies."
        })
        
    if signal_vector.get("relapse_risk_index", 0) > 70:
        insights.append({
            "type": "risk",
            "message": "Elevated relapse risk. Please consider escalated check-ins and connecting with a counselor or sponsor immediately."
        })
        
    insights.append({
        "type": "affirmation",
        "message": "Every day is a new opportunity. You have the strength within you to continue this journey."
    })
    
    return insights

async def submit_assessment(user_id: str, answers: List[Dict[str, Any]]) -> Dict[str, Any]:
    bsv = calculate_behavioral_signal_vector(answers)
    insights = generate_daily_insights(bsv)
    
    assessment_data = {
        "user_id": user_id,
        "answers": answers,
        "signal_vector": bsv,
        "insights": insights,
        "created_at": datetime.utcnow()
    }
    
    created = await assessment_repo.create_assessment(assessment_data)
    return created

async def get_latest_assessment(user_id: str) -> Dict[str, Any]:
    assessment = await assessment_repo.get_latest_by_user(user_id)
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No assessment found")
    return assessment

async def get_insights(user_id: str) -> Dict[str, Any]:
    assessment = await get_latest_assessment(user_id)
    return {
        "insights": assessment.get("insights", []),
        "signal_vector": assessment.get("signal_vector", {})
    }
