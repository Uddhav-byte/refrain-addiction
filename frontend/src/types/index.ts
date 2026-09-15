export interface User {
  id: string
  email: string
  username: string
  full_name: string
  avatar_url?: string
  streak_days: number
  longest_streak: number
  created_at: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface BehavioralSignalVector {
  dopamine_sensitivity: number
  stress_rating: number
  trigger_frequency: number
  relapse_risk_index: number
  computed_at: string
}

export interface DailyInsight {
  insight_id: string
  category: string
  title: string
  description: string
  priority: string
  completed: boolean
}

export interface Assessment {
  id: string
  signal_vector: BehavioralSignalVector
  daily_insights: DailyInsight[]
  created_at: string
}

export interface AssessmentQuestion {
  question_id: string
  question_text: string
  category: string
  min_label?: string
  max_label?: string
}

export interface UrgeLog {
  id: string
  intensity: number
  triggers: string[]
  emotions: string[]
  coping_strategy_used?: string
  duration_minutes?: number
  notes?: string
  resisted: boolean
  created_at: string
}

export interface UrgeTrendDataPoint {
  date: string
  avg_intensity: number
  count: number
  resisted_percentage: number
}

export interface UrgeTrend {
  period: string
  data_points: UrgeTrendDataPoint[]
}

export interface MoodEntry {
  mood_score: number
  craving_score: number
  energy_level: number
  notes?: string
  recorded_at: string
}

export interface MilestoneBadge {
  badge_id: string
  name: string
  description: string
  icon: string
  days_required: number
  earned: boolean
  earned_at?: string
}

export interface Dashboard {
  streak_days: number
  longest_streak: number
  total_urges_resisted: number
  total_days_tracked: number
  current_milestones: MilestoneBadge[]
  relapse_risk_level: string
}

export interface MoodTrendDataPoint {
  date: string
  mood: number
  craving: number
  energy: number
}

export interface MoodTrend {
  period: string
  data_points: MoodTrendDataPoint[]
}

export interface TriggerHeatmapData {
  day_of_week: number
  hour: number
  count: number
}

export interface TriggerHeatmap {
  data: TriggerHeatmapData[]
}

export interface ChatMessage {
  id: string
  room_id: string
  user_id: string
  username: string
  content: string
  message_type: string
  created_at: string
}

export interface ChatRoom {
  room_id: string
  name: string
  description: string
  room_type: string
  online_count: number
  is_active: boolean
}
