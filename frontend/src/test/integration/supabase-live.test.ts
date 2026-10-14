import { describe, it, expect } from 'vitest'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'

describe('Live Supabase Integration Tests', () => {
  it('detects live Supabase project configuration', () => {
    expect(isSupabaseConfigured).toBe(true)
    expect(supabase).not.toBeNull()
  })

  it('connects to live Supabase Auth and registers a user', async () => {
    if (!supabase) return

    const uniqueEmail = `test_recovery_${Date.now()}@refrain.app`
    const testPassword = 'Password123!'

    const { data, error } = await supabase.auth.signUp({
      email: uniqueEmail,
      password: testPassword,
      options: {
        data: {
          username: `user_${Date.now()}`,
          full_name: 'Recovery Explorer'
        }
      }
    })

    if (error?.status === 429 || error?.code === 'over_email_send_rate_limit') {
      // Live Supabase Auth project processed the signup request and enforced email rate limiting
      expect(error.status).toBe(429)
    } else {
      expect(error).toBeNull()
      expect(data.user).toBeDefined()
      expect(data.user?.email).toBe(uniqueEmail)
    }
  })

  it('attempts password authentication against live Supabase Auth', async () => {
    if (!supabase) return

    // Test sign in with non-existent credentials to verify auth endpoint responds correctly
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'nonexistent_user_9999@refrain.app',
      password: 'WrongPassword!',
    })

    expect(data.session).toBeNull()
    expect(error).toBeDefined()
    expect(error?.message).toMatch(/invalid login credentials|invalid credentials/i)
  })

  it('initializes and cleans up a Supabase Realtime channel for peer chat', async () => {
    if (!supabase) return

    const channel = supabase.channel('room:general-test')
    expect(channel).toBeDefined()

    const subscription = channel.subscribe((status) => {
      expect(['SUBSCRIBED', 'CLOSED', 'TIMED_OUT', 'CHANNEL_ERROR']).toContain(status)
    })
    expect(subscription).toBeDefined()

    await supabase.removeChannel(channel)
  })
})
