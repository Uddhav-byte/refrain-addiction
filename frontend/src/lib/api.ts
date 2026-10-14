import { supabaseDb, isSupabaseConfigured } from './supabase'
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
  DailyInsight
} from '../types'

export { isSupabaseConfigured }

export const auth = {
  login: async (email: string, password: string): Promise<TokenResponse> => {
    return supabaseDb.signIn(email, password)
  },
  register: async (email: string, username: string, password: string, full_name: string): Promise<TokenResponse> => {
    return supabaseDb.signUp(email, password, username, full_name)
  },
  getProfile: async (): Promise<User> => {
    return supabaseDb.getProfile()
  },
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    return supabaseDb.updateProfile(updates)
  },
  resetStreak: async (): Promise<User> => {
    return supabaseDb.resetStreak()
  },
  refreshToken: async (): Promise<TokenResponse> => {
    const token = localStorage.getItem('access_token') || 'refreshed-token'
    return { access_token: token, token_type: 'bearer' }
  },
  logout: async (): Promise<void> => {
    return supabaseDb.signOut()
  }
}

export const assessments = {
  getQuestions: async (): Promise<AssessmentQuestion[]> => {
    return supabaseDb.getAssessmentQuestions()
  },
  submitAssessment: async (answers: Record<string, any>): Promise<Assessment> => {
    // If wrapped in { answers: ... } extract it
    const cleanAnswers = answers.answers ? answers.answers : answers
    return supabaseDb.submitAssessment(cleanAnswers)
  },
  getLatestAssessment: async (): Promise<Assessment> => {
    return supabaseDb.getLatestAssessment()
  },
  getInsights: async (): Promise<DailyInsight[]> => {
    return supabaseDb.getInsights()
  },
}

export const analytics = {
  getDashboard: async (): Promise<Dashboard> => {
    return supabaseDb.getDashboard()
  },
  logMood: async (data: Partial<MoodEntry>): Promise<MoodEntry> => {
    return supabaseDb.logMood(data)
  },
  getMoodTrends: async (period: number | string = 30): Promise<MoodTrend> => {
    return supabaseDb.getMoodTrends(period)
  },
  getTriggerHeatmap: async (): Promise<TriggerHeatmap> => {
    return supabaseDb.getTriggerHeatmap()
  },
}

export const urges = {
  logUrge: async (data: Partial<UrgeLog>): Promise<UrgeLog> => {
    return supabaseDb.logUrge(data)
  },
  getUrgeLogs: async (skip = 0, limit = 50): Promise<UrgeLog[]> => {
    return supabaseDb.getUrgeLogs(skip, limit)
  },
  getUrgeTrends: async (period: string = '30d'): Promise<UrgeTrend> => {
    return supabaseDb.getUrgeTrends(period)
  },
}

export const chat = {
  getRooms: async (): Promise<ChatRoom[]> => {
    return supabaseDb.getChatRooms()
  },
  getRoomMessages: async (roomId: string, limit = 50): Promise<ChatMessage[]> => {
    return supabaseDb.getChatMessages(roomId, limit)
  },
  sendMessage: async (roomId: string, content: string): Promise<ChatMessage> => {
    return supabaseDb.sendChatMessage(roomId, content)
  },
  subscribe: (roomId: string, onNewMessage: (msg: ChatMessage) => void) => {
    return supabaseDb.subscribeToChatRoom(roomId, onNewMessage)
  }
}

export const api = {
  auth,
  assessments,
  analytics,
  urges,
  chat,
}

export default api
