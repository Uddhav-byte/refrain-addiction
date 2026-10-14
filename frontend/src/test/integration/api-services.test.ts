import { describe, it, expect, beforeEach } from 'vitest'
import { api } from '../../lib/api'
import { localRepo } from '../../lib/supabase'

describe('Platform Service Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localRepo.ensureDemoUser()
  })

  describe('Auth & Profile Management', () => {
    it('retrieves user profile', async () => {
      const profile = await api.auth.getProfile()
      expect(profile).toBeDefined()
      expect(profile.id).toBeDefined()
      expect(profile.email).toContain('@')
    })

    it('updates user display name and username', async () => {
      const updated = await api.auth.updateProfile({
        full_name: 'Morgan Vance',
        username: 'morgan_recovery',
      })
      expect(updated.full_name).toBe('Morgan Vance')
      expect(updated.username).toBe('morgan_recovery')

      const verified = await api.auth.getProfile()
      expect(verified.full_name).toBe('Morgan Vance')
      expect(verified.username).toBe('morgan_recovery')
    })

    it('resets user clean streak with compassionate logging', async () => {
      const reset = await api.auth.resetStreak()
      expect(reset.streak_days).toBe(0)
    })
  })

  describe('Behavioral Assessment Engine', () => {
    it('fetches assessment questions', async () => {
      const questions = await api.assessments.getQuestions()
      expect(questions.length).toBeGreaterThanOrEqual(16)
      expect(questions[0]).toHaveProperty('category')
      expect(questions[0]).toHaveProperty('text')
    })

    it('submits assessment answers and computes signal vector', async () => {
      const answers = { t1: 8, t2: 7, s1: 6, e1: 8, r1: 5 }
      const assessment = await api.assessments.submitAssessment({ answers })

      expect(assessment).toBeDefined()
      expect(assessment.signal_vector).toBeDefined()
      expect(assessment.signal_vector.stress_rating).toBe(80)
      expect(assessment.signal_vector.relapse_risk_index).toBeGreaterThan(0)
      expect(assessment.daily_insights.length).toBeGreaterThan(0)
    })

    it('retrieves latest assessment and insights', async () => {
      const latest = await api.assessments.getLatestAssessment()
      expect(latest).toBeDefined()
      expect(latest.signal_vector).toBeDefined()

      const insights = await api.assessments.getInsights()
      expect(Array.isArray(insights)).toBe(true)
    })
  })

  describe('Mood Check-Ins & Craving Trends', () => {
    it('logs a daily mood entry and reflects in trends', async () => {
      const entry = await api.analytics.logMood({
        mood_score: 8,
        craving_score: 2,
        energy_level: 9,
        notes: 'Feeling centered after morning meditation.',
      })

      expect(entry.mood_score).toBe(8)
      expect(entry.craving_score).toBe(2)
      expect(entry.energy_level).toBe(9)

      const trends = await api.analytics.getMoodTrends('7d')
      expect(trends).toBeDefined()
      expect(trends.data_points.length).toBeGreaterThan(0)
    })
  })

  describe('Urge Logging & Surfing', () => {
    it('logs an urge and increments resisted count', async () => {
      const urge = await api.urges.logUrge({
        intensity: 7,
        triggers: ['Stress', 'Late Night'],
        emotions: ['Anxious', 'Tired'],
        copingStrategyUsed: '4-7-8 Breathing Cycle',
        durationMinutes: 6,
        notes: 'Intense craving passed after 5 minutes.',
        resisted: true,
      })

      expect(urge.intensity).toBe(7)
      expect(urge.resisted).toBe(true)
      expect(urge.triggers).toContain('Stress')

      const list = await api.urges.getUrgeLogs(0, 10)
      expect(list.length).toBeGreaterThan(0)
      expect(list[0].intensity).toBe(7)
    })

    it('computes urge trends and resisted percentage', async () => {
      const trends = await api.urges.getUrgeTrends('30d')
      expect(trends).toBeDefined()
      expect(trends.data_points.length).toBeGreaterThan(0)
      expect(trends.data_points[0]).toHaveProperty('avg_intensity')
      expect(trends.data_points[0]).toHaveProperty('resisted_percentage')
    })
  })

  describe('Dashboard Metrics & Badges', () => {
    it('computes full recovery dashboard with streak and badges', async () => {
      const dashboard = await api.analytics.getDashboard()

      expect(dashboard).toBeDefined()
      expect(dashboard.streak).toBeDefined()
      expect(dashboard.streak?.current).toBeGreaterThanOrEqual(0)
      expect(dashboard.stats?.urgesResisted).toBeGreaterThanOrEqual(0)
      expect(dashboard.badges?.length).toBeGreaterThanOrEqual(9)

      const firstBadge = dashboard.badges?.find(b => b.badge_id === 'first_step')
      expect(firstBadge).toBeDefined()
    })

    it('generates 7x24 trigger heatmap data', async () => {
      const heatmap = await api.analytics.getTriggerHeatmap()
      expect(heatmap.data).toBeDefined()
      expect(heatmap.data?.length).toBe(7 * 24)
    })
  })

  describe('Community Chat & Rooms', () => {
    it('fetches recovery chat rooms', async () => {
      const rooms = await api.chat.getRooms()
      expect(rooms.length).toBeGreaterThanOrEqual(4)
      const roomIds = rooms.map(r => r.room_id || r.id)
      expect(roomIds).toContain('general')
      expect(roomIds).toContain('urge-surfing')
    })

    it('sends and retrieves chat messages in room', async () => {
      const testContent = `Stay strong everyone! ${Date.now()}`
      const sent = await api.chat.sendMessage('general', testContent)

      expect(sent).toBeDefined()
      expect(sent.content).toBe(testContent)
      expect(sent.room_id).toBe('general')

      const messages = await api.chat.getRoomMessages('general', 50)
      const found = messages.find(m => m.content === testContent)
      expect(found).toBeDefined()
    })
  })
})
