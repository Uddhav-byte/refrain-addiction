import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type {
  User,
  TokenResponse,
  AssessmentQuestion,
  Assessment,
  Dashboard,
  MoodEntry,
  MoodTrend,
  TriggerHeatmap,
  UrgeLog,
  UrgeTrend,
  ChatRoom,
  ChatMessage,
  MilestoneBadge,
  DailyInsight
} from '../types'

// Check environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder') &&
  supabaseUrl.startsWith('http')
)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

// ============================================================================
// DEFAULT CONSTANTS & SEED DATA
// ============================================================================
export const DEFAULT_QUESTIONS: AssessmentQuestion[] = [
  { id: 't1', category: 'triggers', text: 'How often do you encounter your primary addiction trigger?', min_label: 'Rarely', max_label: 'Constantly' },
  { id: 't2', category: 'triggers', text: 'How strong are environmental cues and temptations in your daily routine?', min_label: 'Weak', max_label: 'Overwhelming' },
  { id: 't3', category: 'triggers', text: 'Rate the social pressure from peers, coworkers, or digital feeds:', min_label: 'None', max_label: 'Extreme' },
  { id: 't4', category: 'triggers', text: 'How often do intrusive cravings or thoughts occupy your mind?', min_label: 'Seldom', max_label: 'All day' },
  { id: 's1', category: 'severity', text: 'Rate the intensity of physical or psychological craving spikes:', min_label: 'Mild', max_label: 'Severe' },
  { id: 's2', category: 'severity', text: 'How dependent does your daily productivity or comfort feel on this habit?', min_label: 'Independent', max_label: 'Dependent' },
  { id: 's3', category: 'severity', text: 'Tolerance level (needing higher stimulation to feel satisfaction):', min_label: 'Normal', max_label: 'High tolerance' },
  { id: 's4', category: 'severity', text: 'Impact of the habit on sleep, concentration, or personal relationships:', min_label: 'Minimal', max_label: 'Disruptive' },
  { id: 'e1', category: 'emotional', text: 'Current baseline stress level over the past week:', min_label: 'Calm', max_label: 'Very stressed' },
  { id: 'e2', category: 'emotional', text: 'Frequency of feelings of anxiety, restlessness, or irritability:', min_label: 'Infrequent', max_label: 'Constant' },
  { id: 'e3', category: 'emotional', text: 'Your confidence in regulating negative emotions without giving in:', min_label: 'Low confidence', max_label: 'High confidence' },
  { id: 'e4', category: 'emotional', text: 'Strength of your personal support network (friends, family, mentors):', min_label: 'Isolated', max_label: 'Strongly supported' },
  { id: 'r1', category: 'relapse_risk', text: 'Confidence in sustaining your clean streak today and this week:', min_label: 'Uncertain', max_label: 'Unshakable' },
  { id: 'r2', category: 'relapse_risk', text: 'Frequency of past slips, relapses, or breaking commitments:', min_label: 'Never', max_label: 'Frequent' },
  { id: 'r3', category: 'relapse_risk', text: 'Readiness to use urge surfing or mindfulness when cravings peak:', min_label: 'Unprepared', max_label: 'Ready to surf' },
  { id: 'r4', category: 'relapse_risk', text: 'Overall motivation and personal conviction for transformation:', min_label: 'Low', max_label: 'Maximum' },
]

export const MILESTONE_DEFINITIONS: Array<{ badge_id: string; name: string; description: string; icon: string; days_required: number }> = [
  { badge_id: 'first_step', name: 'First Step', description: 'Committed to recovery (Day 1)', icon: '🌱', days_required: 1 },
  { badge_id: 'getting_started', name: 'Getting Started', description: '3 clean days reached', icon: '🌿', days_required: 3 },
  { badge_id: 'one_week', name: 'One Week Strong', description: '7 clean days reached', icon: '💪', days_required: 7 },
  { badge_id: 'two_weeks', name: 'Two Weeks Clear', description: '14 clean days reached', icon: '⭐', days_required: 14 },
  { badge_id: 'monthly_warrior', name: 'Monthly Warrior', description: '30 clean days reached', icon: '🛡️', days_required: 30 },
  { badge_id: 'two_months', name: 'Momentum Master', description: '60 clean days reached', icon: '🔥', days_required: 60 },
  { badge_id: 'quarter_champion', name: 'Quarter Champion', description: '90 clean days reached', icon: '👑', days_required: 90 },
  { badge_id: 'half_year', name: 'Half Year Hero', description: '180 clean days reached', icon: '🌟', days_required: 180 },
  { badge_id: 'one_year', name: 'One Year Legend', description: '365 clean days reached', icon: '🏆', days_required: 365 },
]

export const DEFAULT_ROOMS: ChatRoom[] = [
  {
    id: 'general',
    room_id: 'general',
    name: 'General Recovery',
    description: 'A safe, supportive place for general recovery conversations and daily reflections.',
    type: 'general',
    room_type: 'general',
    online_count: 14,
    onlineCount: 14,
    is_active: true,
  },
  {
    id: 'urge-surfing',
    room_id: 'urge-surfing',
    name: 'Urge Surfing Station',
    description: 'Emergency check-ins and live support when cravings or urges strike.',
    type: 'emergency',
    room_type: 'emergency',
    online_count: 9,
    onlineCount: 9,
    is_active: true,
  },
  {
    id: 'mindfulness',
    room_id: 'mindfulness',
    name: 'Mindfulness & Meditation',
    description: 'Share breathing exercises, meditation practices, and calm moments.',
    type: 'support',
    room_type: 'support',
    online_count: 6,
    onlineCount: 6,
    is_active: true,
  },
  {
    id: 'milestones',
    room_id: 'milestones',
    name: 'Celebrations & Milestones',
    description: 'Share your streak victories and inspire others in the community.',
    type: 'celebration',
    room_type: 'general',
    online_count: 18,
    onlineCount: 18,
    is_active: true,
  },
]

// ============================================================================
// PERSISTENT LOCAL STORE (Used when Supabase is not configured or in Demo Mode)
// ============================================================================
class LocalStorageRepository {
  private getUserKey(): string {
    return 'refrain_local_user'
  }

  getUser(): User | null {
    const raw = localStorage.getItem(this.getUserKey())
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch (e) {
        // invalid JSON
      }
    }
    return null
  }

  setUser(user: User | null): void {
    if (!user) {
      localStorage.removeItem(this.getUserKey())
    } else {
      localStorage.setItem(this.getUserKey(), JSON.stringify(user))
    }
  }

  ensureDemoUser(): User {
    const existing = this.getUser()
    if (existing) return existing

    const demoUser: User = {
      id: 'demo-user-1234',
      email: 'demo@refrain.app',
      username: 'recovery_pioneer',
      full_name: 'Alex Rivera',
      name: 'Alex Rivera',
      streak_days: 12,
      longest_streak: 28,
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    }
    this.setUser(demoUser)

    // Pre-seed mock history if empty
    if (!localStorage.getItem('refrain_local_urges')) {
      const mockUrges: UrgeLog[] = [
        {
          id: 'u-1',
          intensity: 7,
          triggers: ['Stress', 'Boredom'],
          emotions: ['Anxious', 'Restless'],
          coping_strategy_used: 'Urge Surfing 4-7-8 Breathing',
          duration_minutes: 8,
          notes: 'Worked late on deadlines, got sudden urge. Breathing exercise helped calm down.',
          resisted: true,
          created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
          timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
        },
        {
          id: 'u-2',
          intensity: 5,
          triggers: ['Social Pressure'],
          emotions: ['Tempted'],
          coping_strategy_used: 'Left the room, drank cold water',
          duration_minutes: 5,
          notes: 'Went for a brisk walk around the block.',
          resisted: true,
          created_at: new Date(Date.now() - 28 * 3600000).toISOString(),
          timestamp: new Date(Date.now() - 28 * 3600000).toISOString(),
        },
        {
          id: 'u-3',
          intensity: 4,
          triggers: ['Habit/Routine'],
          emotions: ['Bored'],
          coping_strategy_used: 'Journaling & 5 min meditation',
          duration_minutes: 10,
          notes: 'Standard evening trigger. Reflected in my journal.',
          resisted: true,
          created_at: new Date(Date.now() - 52 * 3600000).toISOString(),
          timestamp: new Date(Date.now() - 52 * 3600000).toISOString(),
        },
      ]
      localStorage.setItem('refrain_local_urges', JSON.stringify(mockUrges))
    }

    if (!localStorage.getItem('refrain_local_moods')) {
      const mockMoods: MoodEntry[] = []
      for (let i = 14; i >= 0; i--) {
        mockMoods.push({
          mood_score: Math.min(10, Math.max(3, 7 + Math.sin(i * 0.7) * 2)),
          craving_score: Math.max(1, Math.min(8, 4 - Math.sin(i * 0.5) * 2)),
          energy_level: Math.min(10, Math.max(4, 6 + Math.cos(i * 0.6) * 2)),
          notes: i === 0 ? 'Feeling grounded and grateful today.' : undefined,
          recorded_at: new Date(Date.now() - i * 86400000).toISOString(),
        })
      }
      localStorage.setItem('refrain_local_moods', JSON.stringify(mockMoods))
    }

    if (!localStorage.getItem('refrain_local_messages')) {
      const initialMessages: ChatMessage[] = [
        {
          id: 'm-1',
          room_id: 'general',
          user_id: 'user-support-1',
          username: 'Maya_S',
          content: 'Good morning everyone! Day 42 clean today. Grateful for this community!',
          message_type: 'text',
          created_at: new Date(Date.now() - 45 * 60000).toISOString(),
        },
        {
          id: 'm-2',
          room_id: 'general',
          user_id: 'user-support-2',
          username: 'Jordan_K',
          content: 'Congratulations Maya! That milestone inspires me to keep pushing.',
          message_type: 'text',
          created_at: new Date(Date.now() - 32 * 60000).toISOString(),
        },
        {
          id: 'm-3',
          room_id: 'urge-surfing',
          user_id: 'user-support-3',
          username: 'David_R',
          content: 'Just rode out an intense 8/10 craving using the breathing timer. Urges really do pass!',
          message_type: 'text',
          created_at: new Date(Date.now() - 15 * 60000).toISOString(),
        },
        {
          id: 'm-4',
          room_id: 'milestones',
          user_id: 'demo-user-1234',
          username: 'recovery_pioneer',
          content: 'Hit two weeks clean! The streak tracker keeps me accountable every single day.',
          message_type: 'text',
          created_at: new Date(Date.now() - 10 * 60000).toISOString(),
        },
      ]
      localStorage.setItem('refrain_local_messages', JSON.stringify(initialMessages))
    }

    return demoUser
  }

  getUrges(): UrgeLog[] {
    const raw = localStorage.getItem('refrain_local_urges')
    return raw ? JSON.parse(raw) : []
  }

  saveUrge(urge: UrgeLog): UrgeLog {
    const list = this.getUrges()
    const newEntry: UrgeLog = {
      ...urge,
      id: urge.id || `urge-${Date.now()}`,
      created_at: urge.created_at || new Date().toISOString(),
      timestamp: urge.timestamp || new Date().toISOString(),
    }
    list.unshift(newEntry)
    localStorage.setItem('refrain_local_urges', JSON.stringify(list))

    // If resisted, check streak increment
    const user = this.getUser()
    if (user && urge.resisted) {
      user.streak_days = (user.streak_days || 0) + 1
      user.longest_streak = Math.max(user.longest_streak || 0, user.streak_days)
      this.setUser(user)
    }

    return newEntry
  }

  getMoods(): MoodEntry[] {
    const raw = localStorage.getItem('refrain_local_moods')
    return raw ? JSON.parse(raw) : []
  }

  saveMood(mood: Partial<MoodEntry>): MoodEntry {
    const list = this.getMoods()
    const entry: MoodEntry = {
      mood_score: mood.mood_score || 7,
      craving_score: mood.craving_score || 3,
      energy_level: mood.energy_level || 7,
      notes: mood.notes || '',
      recorded_at: mood.recorded_at || new Date().toISOString(),
    }
    list.unshift(entry)
    localStorage.setItem('refrain_local_moods', JSON.stringify(list))

    // Mark check-in streak
    const user = this.getUser()
    if (user && user.streak_days === 0) {
      user.streak_days = 1
      user.longest_streak = Math.max(user.longest_streak || 1, 1)
      this.setUser(user)
    }

    return entry
  }

  getMessages(roomId: string): ChatMessage[] {
    const raw = localStorage.getItem('refrain_local_messages')
    const all: ChatMessage[] = raw ? JSON.parse(raw) : []
    return all.filter((m) => m.room_id === roomId)
  }

  addMessage(msg: ChatMessage): ChatMessage {
    const raw = localStorage.getItem('refrain_local_messages')
    const all: ChatMessage[] = raw ? JSON.parse(raw) : []
    const fullMsg: ChatMessage = {
      ...msg,
      id: msg.id || `msg-${Date.now()}`,
      created_at: msg.created_at || new Date().toISOString(),
    }
    all.push(fullMsg)
    localStorage.setItem('refrain_local_messages', JSON.stringify(all))
    return fullMsg
  }

  getAssessment(): Assessment | null {
    const raw = localStorage.getItem('refrain_local_assessment')
    return raw ? JSON.parse(raw) : null
  }

  saveAssessment(answers: Record<string, any>): Assessment {
    const values = Object.values(answers).map(Number).filter((v) => !isNaN(v))
    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 5

    const signalVector = {
      dopamine_sensitivity: Math.round(avg * 10),
      stress_rating: Math.round((answers['e1'] || 5) * 10),
      trigger_frequency: Math.round((answers['t1'] || 5) * 10),
      relapse_risk_index: Math.round(Math.max(10, Math.min(95, 100 - (answers['r1'] || 5) * 10 + 20))),
      computed_at: new Date().toISOString(),
    }

    const dailyInsights: DailyInsight[] = [
      {
        id: 'ins-1',
        category: 'Urge Surfing',
        title: 'Master the 4-7-8 Breathing Cycle',
        description: 'When craving spikes occur, dopamine levels urge immediate gratification. Use 3 minutes of 4-7-8 breathing to activate the parasympathetic nervous system.',
        priority: 'high',
        completed: false,
      },
      {
        id: 'ins-2',
        category: 'Trigger Management',
        title: 'Environmental Detox & Cue Disruption',
        description: 'Your assessment flagged environmental triggers. Remove cues from your visual field and disrupt subconscious habit loops with healthy substitutes.',
        priority: 'medium',
        completed: true,
      },
      {
        id: 'ins-3',
        category: 'Mindset',
        title: 'Reflect in Community Chat',
        description: 'Recovery thrives in supportive connections. Drop a check-in message in the General Recovery room today.',
        priority: 'low',
        completed: false,
      },
    ]

    const assessment: Assessment = {
      id: `ass-${Date.now()}`,
      signal_vector: signalVector,
      daily_insights: dailyInsights,
      created_at: new Date().toISOString(),
    }

    localStorage.setItem('refrain_local_assessment', JSON.stringify(assessment))
    return assessment
  }
}

export const localRepo = new LocalStorageRepository()

// ============================================================================
// UNIFIED DATA SERVICE (SUPABASE WITH AUTOMATIC LOCAL FALLBACK)
// ============================================================================

export const supabaseDb = {
  // --------------------------------------------------------------------------
  // AUTH & PROFILES
  // --------------------------------------------------------------------------
  async signUp(email: string, password: string, username: string, fullName: string): Promise<TokenResponse> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
          },
        },
      })
      if (error) throw new Error(error.message)

      if (data.user) {
        // Upsert profile in Supabase public.profiles
        await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email,
            username,
            full_name: fullName,
            streak_days: 1,
            longest_streak: 1,
            last_relapse_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()

        const token = data.session?.access_token || `token-${data.user.id}`
        localStorage.setItem('access_token', token)
        return { access_token: token, token_type: 'bearer' }
      }
    }

    // Local fallback
    const id = `user-${Date.now()}`
    const newUser: User = {
      id,
      email,
      username,
      full_name: fullName,
      name: fullName,
      streak_days: 1,
      longest_streak: 1,
      created_at: new Date().toISOString(),
    }
    localRepo.setUser(newUser)
    const token = `local-token-${id}`
    localStorage.setItem('access_token', token)
    return { access_token: token, token_type: 'bearer' }
  },

  async signIn(email: string, password: string): Promise<TokenResponse> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw new Error(error.message)

      const token = data.session?.access_token || ''
      localStorage.setItem('access_token', token)
      return { access_token: token, token_type: 'bearer' }
    }

    // Local fallback
    const user = localRepo.getUser() || localRepo.ensureDemoUser()
    const token = `local-token-${user.id}`
    localStorage.setItem('access_token', token)
    return { access_token: token, token_type: 'bearer' }
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    }
    localStorage.removeItem('access_token')
  },

  async getProfile(): Promise<User> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          return {
            id: profile.id,
            email: profile.email || user.email || '',
            username: profile.username || 'user',
            full_name: profile.full_name || profile.username || 'Friend',
            name: profile.full_name,
            avatar_url: profile.avatar_url,
            streak_days: profile.streak_days || 0,
            longest_streak: profile.longest_streak || 0,
            created_at: profile.created_at,
          }
        }
      }
    }

    // Local fallback
    return localRepo.getUser() || localRepo.ensureDemoUser()
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: updated } = await supabase
          .from('profiles')
          .update({
            full_name: updates.full_name,
            username: updates.username,
            avatar_url: updates.avatar_url,
            bio: (updates as any).bio,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)
          .select()
          .single()

        if (updated) {
          return {
            id: updated.id,
            email: updated.email,
            username: updated.username,
            full_name: updated.full_name,
            streak_days: updated.streak_days,
            longest_streak: updated.longest_streak,
            created_at: updated.created_at,
          }
        }
      }
    }

    const current = localRepo.getUser() || localRepo.ensureDemoUser()
    const merged = { ...current, ...updates }
    localRepo.setUser(merged)
    return merged
  },

  async resetStreak(): Promise<User> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: updated } = await supabase
          .from('profiles')
          .update({
            streak_days: 0,
            last_relapse_date: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)
          .select()
          .single()

        if (updated) {
          return {
            id: updated.id,
            email: updated.email,
            username: updated.username,
            full_name: updated.full_name,
            streak_days: 0,
            longest_streak: updated.longest_streak,
            created_at: updated.created_at,
          }
        }
      }
    }

    const current = localRepo.getUser() || localRepo.ensureDemoUser()
    current.streak_days = 0
    localRepo.setUser(current)
    return current
  },

  // --------------------------------------------------------------------------
  // ASSESSMENTS
  // --------------------------------------------------------------------------
  async getAssessmentQuestions(): Promise<AssessmentQuestion[]> {
    return DEFAULT_QUESTIONS
  },

  async submitAssessment(answers: Record<string, any>): Promise<Assessment> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const localGenerated = localRepo.saveAssessment(answers)
        const { data, error } = await supabase
          .from('assessments')
          .insert({
            user_id: user.id,
            answers,
            signal_vector: localGenerated.signal_vector,
            insights: localGenerated.daily_insights,
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (data && !error) {
          return {
            id: data.id,
            signal_vector: data.signal_vector,
            daily_insights: data.insights || localGenerated.daily_insights,
            created_at: data.created_at,
          }
        }
      }
    }

    return localRepo.saveAssessment(answers)
  },

  async getLatestAssessment(): Promise<Assessment> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (data && !error) {
          return {
            id: data.id,
            signal_vector: data.signal_vector,
            daily_insights: data.insights || [],
            created_at: data.created_at,
          }
        }
      }
    }

    const existing = localRepo.getAssessment()
    if (existing) return existing
    return localRepo.saveAssessment({ t1: 6, s1: 5, e1: 7, r1: 6 })
  },

  async getInsights(): Promise<DailyInsight[]> {
    const assessment = await this.getLatestAssessment()
    return assessment.daily_insights || []
  },

  // --------------------------------------------------------------------------
  // URGES
  // --------------------------------------------------------------------------
  async logUrge(urgeData: Partial<UrgeLog>): Promise<UrgeLog> {
    const logToSave: UrgeLog = {
      intensity: urgeData.intensity || 5,
      triggers: urgeData.triggers || [],
      emotions: urgeData.emotions || [],
      coping_strategy_used: urgeData.coping_strategy_used || urgeData.copingStrategyUsed || 'Urge Surfing',
      copingStrategyUsed: urgeData.coping_strategy_used || urgeData.copingStrategyUsed || 'Urge Surfing',
      duration_minutes: urgeData.duration_minutes ?? urgeData.durationMinutes ?? 5,
      durationMinutes: urgeData.duration_minutes ?? urgeData.durationMinutes ?? 5,
      notes: urgeData.notes || '',
      resisted: urgeData.resisted ?? true,
      created_at: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    }

    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('urges')
          .insert({
            user_id: user.id,
            intensity: logToSave.intensity,
            triggers: logToSave.triggers,
            emotions: logToSave.emotions,
            coping_strategy_used: logToSave.coping_strategy_used,
            duration_minutes: logToSave.duration_minutes,
            notes: logToSave.notes,
            resisted: logToSave.resisted,
            created_at: logToSave.created_at,
          })
          .select()
          .single()

        if (data && !error) {
          // Increment profile streak if resisted
          if (logToSave.resisted) {
            const { data: prof } = await supabase.from('profiles').select('streak_days, longest_streak').eq('id', user.id).single()
            if (prof) {
              const newStreak = (prof.streak_days || 0) + 1
              const newLongest = Math.max(prof.longest_streak || 0, newStreak)
              await supabase.from('profiles').update({ streak_days: newStreak, longest_streak: newLongest }).eq('id', user.id)
            }
          }

          return {
            id: data.id,
            intensity: data.intensity,
            triggers: data.triggers,
            emotions: data.emotions,
            coping_strategy_used: data.coping_strategy_used,
            copingStrategyUsed: data.coping_strategy_used,
            duration_minutes: data.duration_minutes,
            durationMinutes: data.duration_minutes,
            notes: data.notes,
            resisted: data.resisted,
            created_at: data.created_at,
            timestamp: data.created_at,
          }
        }
      }
    }

    return localRepo.saveUrge(logToSave)
  },

  async getUrgeLogs(skip = 0, limit = 50): Promise<UrgeLog[]> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('urges')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .range(skip, skip + limit - 1)

        if (data && !error) {
          return data.map((d: any) => ({
            id: d.id,
            intensity: d.intensity,
            triggers: d.triggers || [],
            emotions: d.emotions || [],
            coping_strategy_used: d.coping_strategy_used,
            copingStrategyUsed: d.coping_strategy_used,
            duration_minutes: d.duration_minutes,
            durationMinutes: d.duration_minutes,
            notes: d.notes,
            resisted: d.resisted,
            created_at: d.created_at,
            timestamp: d.created_at,
          }))
        }
      }
    }

    return localRepo.getUrges().slice(skip, skip + limit)
  },

  async getUrgeTrends(period: string = '30d'): Promise<UrgeTrend> {
    const logs = await this.getUrgeLogs(0, 100)
    const pointsMap: Record<string, { totalIntensity: number; count: number; resistedCount: number }> = {}

    logs.forEach((log) => {
      const dateKey = (log.created_at || log.timestamp || new Date().toISOString()).split('T')[0]
      if (!pointsMap[dateKey]) {
        pointsMap[dateKey] = { totalIntensity: 0, count: 0, resistedCount: 0 }
      }
      pointsMap[dateKey].totalIntensity += log.intensity
      pointsMap[dateKey].count += 1
      if (log.resisted) pointsMap[dateKey].resistedCount += 1
    })

    const dataPoints = Object.entries(pointsMap).map(([date, val]) => ({
      date,
      avg_intensity: Math.round((val.totalIntensity / val.count) * 10) / 10,
      count: val.count,
      resisted_percentage: Math.round((val.resistedCount / val.count) * 100),
    }))

    // Sort by date ascending
    dataPoints.sort((a, b) => a.date.localeCompare(b.date))

    return {
      period,
      data_points: dataPoints.length > 0 ? dataPoints : [
        { date: new Date().toISOString().split('T')[0], avg_intensity: 4.5, count: 1, resisted_percentage: 100 }
      ],
    }
  },

  // --------------------------------------------------------------------------
  // MOODS & DAILY CHECK-INS
  // --------------------------------------------------------------------------
  async logMood(data: Partial<MoodEntry>): Promise<MoodEntry> {
    const entry: MoodEntry = {
      mood_score: data.mood_score || 7,
      craving_score: data.craving_score || 3,
      energy_level: data.energy_level || 7,
      notes: data.notes || '',
      recorded_at: data.recorded_at || new Date().toISOString(),
    }

    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: saved, error } = await supabase
          .from('moods')
          .insert({
            user_id: user.id,
            mood_score: entry.mood_score,
            craving_score: entry.craving_score,
            energy_level: entry.energy_level,
            notes: entry.notes,
            created_at: entry.recorded_at,
          })
          .select()
          .single()

        if (saved && !error) {
          return {
            mood_score: saved.mood_score,
            craving_score: saved.craving_score,
            energy_level: saved.energy_level,
            notes: saved.notes,
            recorded_at: saved.created_at,
          }
        }
      }
    }

    return localRepo.saveMood(entry)
  },

  async getMoodTrends(period: number | string = 30): Promise<MoodTrend> {
    const numDays = typeof period === 'string' ? parseInt(period.replace(/\D/g, '')) || 30 : period

    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('moods')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(numDays)

        if (data && !error && data.length > 0) {
          return {
            period: `${numDays}d`,
            data_points: data.map((d: any) => ({
              date: d.created_at,
              mood: d.mood_score,
              craving: d.craving_score,
              energy: d.energy_level,
            })),
          }
        }
      }
    }

    const localList = localRepo.getMoods()
    const points = localList.slice(0, numDays).map((m) => ({
      date: m.recorded_at,
      mood: m.mood_score,
      craving: m.craving_score,
      energy: m.energy_level,
    }))
    points.reverse()

    return {
      period: `${numDays}d`,
      data_points: points,
    }
  },

  // --------------------------------------------------------------------------
  // TRIGGER HEATMAP & DASHBOARD ANALYTICS
  // --------------------------------------------------------------------------
  async getTriggerHeatmap(): Promise<TriggerHeatmap> {
    const urges = await this.getUrgeLogs(0, 100)
    const grid: Array<{ day: number; hour: number; count: number }> = []

    // 7 days x 24 hours grid
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        grid.push({ day: d, hour: h, count: 0 })
      }
    }

    urges.forEach((urge) => {
      const date = new Date(urge.created_at || urge.timestamp || Date.now())
      // In JS: 0=Sun, 1=Mon, ..., 6=Sat. Map Mon=0, ..., Sun=6
      const jsDay = date.getDay()
      const dayIndex = jsDay === 0 ? 6 : jsDay - 1
      const hour = date.getHours()

      const cell = grid.find((c) => c.day === dayIndex && c.hour === hour)
      if (cell) {
        cell.count += 1
      }
    })

    // If fresh account with few urges, provide gentle baseline points for realistic visualization
    if (urges.length < 5) {
      grid.find((c) => c.day === 4 && c.hour === 21)!.count += 2
      grid.find((c) => c.day === 5 && c.hour === 22)!.count += 3
      grid.find((c) => c.day === 2 && c.hour === 16)!.count += 1
    }

    return { data: grid, grid }
  },

  async getDashboard(): Promise<Dashboard> {
    const profile = await this.getProfile()
    const urges = await this.getUrgeLogs(0, 100)
    const assessment = await this.getLatestAssessment()

    const urgesResisted = urges.filter((u) => u.resisted).length
    const totalDaysTracked = Math.max(1, profile.streak_days || 1)
    const riskScore = assessment.signal_vector?.relapse_risk_index || 35
    const riskLevel = riskScore > 65 ? 'High' : riskScore > 40 ? 'Moderate' : 'Low'

    // Determine earned badges
    const badges: MilestoneBadge[] = MILESTONE_DEFINITIONS.map((def) => {
      const earned = (profile.streak_days || 0) >= def.days_required
      const daysRemaining = Math.max(0, def.days_required - (profile.streak_days || 0))
      return {
        badge_id: def.badge_id,
        name: def.name,
        description: def.description,
        icon: def.icon,
        days_required: def.days_required,
        earned,
        daysRemaining,
        earned_at: earned ? new Date(Date.now() - (profile.streak_days - def.days_required) * 86400000).toISOString() : undefined,
      }
    })

    // Next milestone
    const nextBadge = MILESTONE_DEFINITIONS.find((b) => b.days_required > (profile.streak_days || 0))
    const nextMilestone = nextBadge ? nextBadge.days_required : 365

    return {
      streak: {
        current: profile.streak_days || 0,
        longest: profile.longest_streak || 0,
        nextMilestone,
      },
      streak_days: profile.streak_days || 0,
      longest_streak: profile.longest_streak || 0,
      total_urges_resisted: urgesResisted,
      total_days_tracked: totalDaysTracked,
      current_milestones: badges,
      badges,
      relapse_risk_level: riskLevel,
      stats: {
        urgesResisted,
        daysTracked: totalDaysTracked,
        riskLevel,
      },
      insights: assessment.daily_insights || [],
    }
  },

  // --------------------------------------------------------------------------
  // COMMUNITY & REALTIME CHAT
  // --------------------------------------------------------------------------
  async getChatRooms(): Promise<ChatRoom[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('chat_rooms').select('*').eq('is_active', true)
      if (data && !error && data.length > 0) {
        return data.map((r: any) => ({
          id: r.id,
          room_id: r.id,
          name: r.name,
          description: r.description,
          type: r.room_type,
          room_type: r.room_type,
          online_count: 5,
          onlineCount: 5,
          is_active: r.is_active,
        }))
      }
    }
    return DEFAULT_ROOMS
  },

  async getChatMessages(roomId: string, limit = 50): Promise<ChatMessage[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(limit)

      if (data && !error && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          room_id: d.room_id,
          user_id: d.user_id,
          userId: d.user_id,
          username: d.username,
          content: d.content,
          message_type: d.message_type,
          created_at: d.created_at,
        }))
      }
    }

    return localRepo.getMessages(roomId)
  },

  async sendChatMessage(roomId: string, content: string): Promise<ChatMessage> {
    const profile = await this.getProfile()
    const msg: ChatMessage = {
      room_id: roomId,
      user_id: profile.id,
      userId: profile.id,
      username: profile.username || 'Explorer',
      content,
      message_type: 'text',
      created_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          user_id: profile.id,
          username: profile.username || 'Explorer',
          content,
          message_type: 'text',
          created_at: msg.created_at,
        })
        .select()
        .single()

      if (data && !error) {
        return {
          id: data.id,
          room_id: data.room_id,
          user_id: data.user_id,
          userId: data.user_id,
          username: data.username,
          content: data.content,
          message_type: data.message_type,
          created_at: data.created_at,
        }
      }
    }

    return localRepo.addMessage(msg)
  },

  /**
   * Subscribe to real-time chat messages via Supabase Realtime Channels
   */
  subscribeToChatRoom(roomId: string, onNewMessage: (msg: ChatMessage) => void) {
    if (isSupabaseConfigured && supabase) {
      const channel = supabase
        .channel(`room:${roomId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `room_id=eq.${roomId}`,
          },
          (payload) => {
            const row = payload.new as any
            onNewMessage({
              id: row.id,
              room_id: row.room_id,
              user_id: row.user_id,
              userId: row.user_id,
              username: row.username,
              content: row.content,
              message_type: row.message_type,
              created_at: row.created_at,
            })
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    // When running in local mode, poll or listen to window storage events
    const listener = (event: StorageEvent) => {
      if (event.key === 'refrain_local_messages' && event.newValue) {
        try {
          const msgs: ChatMessage[] = JSON.parse(event.newValue)
          const latest = msgs[msgs.length - 1]
          if (latest && latest.room_id === roomId) {
            onNewMessage(latest)
          }
        } catch (e) {
          // ignore
        }
      }
    }
    window.addEventListener('storage', listener)
    return () => window.removeEventListener('storage', listener)
  },
}
