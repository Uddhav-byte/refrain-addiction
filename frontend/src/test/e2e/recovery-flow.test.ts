import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from '../../lib/api'
import { localRepo } from '../../lib/supabase'

describe('End-to-End User Recovery Journey Flow', () => {
  beforeEach(() => {
    localStorage.clear()
    localRepo.ensureDemoUser()
    vi.clearAllMocks()
  })

  it('executes complete end-to-end user recovery flow from onboarding to community and data export', async () => {
    // ------------------------------------------------------------------------
    // Step 1: Authentication & Profile Initialization
    // ------------------------------------------------------------------------
    const initialProfile = await api.auth.getProfile()
    expect(initialProfile).toBeDefined()
    expect(initialProfile.email).toBe('demo@refrain.app')
    expect(initialProfile.streak_days).toBeGreaterThanOrEqual(1)
    expect(initialProfile.longest_streak).toBeGreaterThanOrEqual(initialProfile.streak_days)

    // ------------------------------------------------------------------------
    // Step 2: Clinical Baseline Behavioral Assessment
    // ------------------------------------------------------------------------
    const questions = await api.assessments.getQuestions()
    expect(questions.length).toBeGreaterThan(0)

    const userResponses = {
      t1: 8, // trigger sensitivity
      t2: 7, // emotional vulnerability
      s1: 6, // social pressure
      e1: 9, // stress rating
      r1: 4, // resilience baseline
    }

    const assessmentResult = await api.assessments.submitAssessment(userResponses)
    expect(assessmentResult).toBeDefined()
    expect(assessmentResult.signal_vector).toBeDefined()
    expect(assessmentResult.signal_vector.stress_rating).toBe(90)
    expect(assessmentResult.signal_vector.relapse_risk_index).toBeGreaterThan(0)
    expect(assessmentResult.daily_insights.length).toBeGreaterThan(0)

    const latestAssessment = await api.assessments.getLatestAssessment()
    expect(latestAssessment).toBeDefined()
    expect(latestAssessment.signal_vector.stress_rating).toBe(90)

    // ------------------------------------------------------------------------
    // Step 3: Daily Recovery Wellness Check-In (Mood & Energy)
    // ------------------------------------------------------------------------
    const moodLog = await api.analytics.logMood({
      mood_score: 8,
      craving_score: 2,
      energy_level: 7,
      notes: 'Morning mindfulness walk completed. Urge intensity is low and focus is sharp.',
    })
    expect(moodLog).toBeDefined()
    expect(moodLog.mood_score).toBe(8)
    expect(moodLog.craving_score).toBe(2)

    const moodTrends = await api.analytics.getMoodTrends(30)
    expect(moodTrends).toBeDefined()
    expect(moodTrends.data_points.length).toBeGreaterThan(0)

    // ------------------------------------------------------------------------
    // Step 4: Craving Urge Episode Intercepted & Overcome
    // ------------------------------------------------------------------------
    const initialUrges = await api.urges.getUrgeLogs(0, 20)
    const initialCount = initialUrges.length
    const currentStreakBeforeUrge = (await api.auth.getProfile()).streak_days

    const newUrge = await api.urges.logUrge({
      intensity: 7,
      triggers: ['Stress', 'Evening fatigue'],
      emotions: ['Anxious', 'Restless'],
      copingStrategyUsed: 'Urge Surfing Station (4-7-8 Breathing)',
      durationMinutes: 6,
      notes: 'Rode the craving wave using breathing pacer until sensation dissolved.',
      resisted: true,
      timestamp: new Date().toISOString(),
    })
    expect(newUrge).toBeDefined()
    expect(newUrge.resisted).toBe(true)

    const updatedUrges = await api.urges.getUrgeLogs(0, 20)
    expect(updatedUrges.length).toBe(initialCount + 1)
    expect(updatedUrges[0].coping_strategy_used).toContain('Urge Surfing')

    // Clean streak increments when an urge is successfully resisted
    const profileAfterResisting = await api.auth.getProfile()
    expect(profileAfterResisting.streak_days).toBe(currentStreakBeforeUrge + 1)

    // ------------------------------------------------------------------------
    // Step 5: Peer Support Community Chat Interaction
    // ------------------------------------------------------------------------
    const rooms = await api.chat.getRooms()
    expect(rooms.length).toBeGreaterThan(0)
    const targetRoom = rooms[0]!
    const targetRoomId = targetRoom.id || 'general'

    const sentMessage = await api.chat.sendMessage(
      targetRoomId,
      'Just rode out a heavy 7/10 craving wave using urge surfing! Keep holding strong everyone.'
    )
    expect(sentMessage).toBeDefined()
    expect(sentMessage.room_id).toBe(targetRoomId)
    expect(sentMessage.content).toContain('urge surfing')

    const roomMessages = await api.chat.getRoomMessages(targetRoomId)
    expect(roomMessages.some((m) => m.content.includes('urge surfing'))).toBe(true)

    // ------------------------------------------------------------------------
    // Step 6: Unified Dashboard Aggregates & Behavioral Insights
    // ------------------------------------------------------------------------
    const dashboard = await api.analytics.getDashboard()
    expect(dashboard).toBeDefined()
    expect(dashboard.streak).toBeDefined()
    expect(dashboard.streak?.current).toBeGreaterThan(0)
    expect(dashboard.total_urges_resisted).toBeGreaterThanOrEqual(1)
    expect(dashboard.badges?.length).toBeGreaterThanOrEqual(9)
    expect(dashboard.insights?.length).toBeGreaterThanOrEqual(0)

    const heatmap = await api.analytics.getTriggerHeatmap()
    expect(heatmap).toBeDefined()
    expect(heatmap.data?.length).toBe(7 * 24)

    // ------------------------------------------------------------------------
    // Step 7: Profile Customization & Complete Recovery Data Backup/Export
    // ------------------------------------------------------------------------
    const updatedProfile = await api.auth.updateProfile({
      full_name: 'Uddhav Resilient',
      username: 'uddhav_zen',
    })
    expect(updatedProfile.full_name).toBe('Uddhav Resilient')
    expect(updatedProfile.username).toBe('uddhav_zen')

    // Simulate profile data export bundle (as performed on Profile.tsx)
    const [allUrgesExport, moodTrendsExport, assessmentExport] = await Promise.all([
      api.urges.getUrgeLogs(0, 500),
      api.analytics.getMoodTrends(90),
      api.assessments.getLatestAssessment(),
    ])

    const exportBundle = {
      exportedAt: new Date().toISOString(),
      profile: updatedProfile,
      urges: allUrgesExport,
      moodTrend: moodTrendsExport,
      assessment: assessmentExport,
    }

    expect(exportBundle.profile.username).toBe('uddhav_zen')
    expect(exportBundle.urges.length).toBeGreaterThanOrEqual(1)
    expect(exportBundle.moodTrend.data_points.length).toBeGreaterThanOrEqual(1)
    expect(exportBundle.assessment?.signal_vector).toBeDefined()

    // ------------------------------------------------------------------------
    // Step 8: Compassionate Streak Reset
    // ------------------------------------------------------------------------
    const postResetUser = await api.auth.resetStreak()
    expect(postResetUser.streak_days).toBe(0)
    // Longest streak remains preserved as a reminder of user capability
    expect(postResetUser.longest_streak).toBeGreaterThan(0)
  })
})
