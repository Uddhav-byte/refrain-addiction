import { describe, it, expect } from 'vitest'
import { cn, formatDate } from '../../lib/utils'
import { MILESTONE_DEFINITIONS, DEFAULT_QUESTIONS } from '../../lib/supabase'

describe('Utility & Algorithm Unit Tests', () => {
  describe('cn (Tailwind class merger)', () => {
    it('merges class names correctly', () => {
      const result = cn('px-4 py-2', 'bg-blue-500', false && 'hidden', true && 'text-white')
      expect(result).toBe('px-4 py-2 bg-blue-500 text-white')
    })

    it('resolves conflicting tailwind classes cleanly', () => {
      const result = cn('px-4 px-8', 'text-red-500 text-blue-500')
      expect(result).toBe('px-8 text-blue-500')
    })
  })

  describe('formatDate', () => {
    it('formats ISO dates accurately', () => {
      const formatted = formatDate('2026-05-15T12:00:00Z', 'MMM d, yyyy')
      expect(formatted).toContain('2026')
      expect(formatted).toContain('May')
    })

    it('handles custom date formats', () => {
      const formatted = formatDate('2026-01-01T00:00:00Z', 'yyyy')
      expect(formatted).toBe('2026')
    })

    it('returns empty string on empty or undefined input', () => {
      expect(formatDate('')).toBe('')
      expect(formatDate(undefined as any)).toBe('')
    })
  })

  describe('Milestones & Badges Engine', () => {
    it('defines sequential days required for milestones', () => {
      expect(MILESTONE_DEFINITIONS.length).toBeGreaterThanOrEqual(9)
      
      const dayReqs = MILESTONE_DEFINITIONS.map(m => m.days_required)
      for (let i = 1; i < dayReqs.length; i++) {
        expect(dayReqs[i]).toBeGreaterThan(dayReqs[i - 1])
      }
    })

    it('contains First Step (Day 1) and One Year Legend (Day 365)', () => {
      const firstStep = MILESTONE_DEFINITIONS.find(m => m.badge_id === 'first_step')
      expect(firstStep).toBeDefined()
      expect(firstStep?.days_required).toBe(1)

      const yearLegend = MILESTONE_DEFINITIONS.find(m => m.badge_id === 'one_year')
      expect(yearLegend).toBeDefined()
      expect(yearLegend?.days_required).toBe(365)
    })
  })

  describe('Assessment Questions Config', () => {
    it('contains required categories: triggers, severity, emotional, relapse_risk', () => {
      const categories = new Set(DEFAULT_QUESTIONS.map(q => q.category))
      expect(categories.has('triggers')).toBe(true)
      expect(categories.has('severity')).toBe(true)
      expect(categories.has('emotional')).toBe(true)
      expect(categories.has('relapse_risk')).toBe(true)
    })

    it('has at least 16 comprehensive behavioral questions', () => {
      expect(DEFAULT_QUESTIONS.length).toBeGreaterThanOrEqual(16)
    })
  })
})
