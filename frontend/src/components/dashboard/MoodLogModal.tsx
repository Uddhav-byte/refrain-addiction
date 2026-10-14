import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Smile, Flame, Zap, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

interface MoodLogModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const FEELING_TAGS = [
  'Grateful',
  'Calm',
  'Focused',
  'Hopeful',
  'Anxious',
  'Restless',
  'Tired',
  'Overwhelmed',
  'Confident',
  'Proud',
]

export const MoodLogModal: React.FC<MoodLogModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { refreshUser } = useAuth()
  const [moodScore, setMoodScore] = useState<number>(7)
  const [cravingScore, setCravingScore] = useState<number>(3)
  const [energyLevel, setEnergyLevel] = useState<number>(7)
  const [selectedTags, setSelectedTags] = useState<string[]>(['Calm'])
  const [notes, setNotes] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  if (!isOpen) return null

  const getMoodEmoji = (score: number) => {
    if (score >= 9) return { emoji: '🌟', label: 'Thriving & Empowered', color: 'text-emerald-500' }
    if (score >= 7) return { emoji: '🙂', label: 'Good & Balanced', color: 'text-green-500' }
    if (score >= 5) return { emoji: '😐', label: 'Steady / Neutral', color: 'text-amber-500' }
    if (score >= 3) return { emoji: '😔', label: 'Vulnerable / Low', color: 'text-orange-500' }
    return { emoji: '😣', label: 'Struggling / High Stress', color: 'text-rose-500' }
  }

  const getCravingLabel = (score: number) => {
    if (score <= 3) return { label: 'Minimal / Mild', color: 'text-green-500' }
    if (score <= 6) return { label: 'Moderate / Noticeable', color: 'text-amber-500' }
    return { label: 'Intense / High Spike', color: 'text-rose-500' }
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formattedNotes = selectedTags.length > 0
        ? `[Tags: ${selectedTags.join(', ')}] ${notes}`.trim()
        : notes

      await api.analytics.logMood({
        mood_score: moodScore,
        craving_score: cravingScore,
        energy_level: energyLevel,
        notes: formattedNotes,
        recorded_at: new Date().toISOString(),
      })

      // Celebration
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      })

      toast.success('Daily check-in logged! Proud of your self-awareness.')
      await refreshUser()
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      toast.error('Failed to log check-in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const moodInfo = getMoodEmoji(moodScore)
  const cravingInfo = getCravingLabel(cravingScore)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Daily Recovery Check-In</h3>
                <p className="text-xs text-muted-foreground">Check in with your mind and body today</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-muted"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 pt-5">
            {/* 1. Mood Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-primary" /> Overall Mood
                </span>
                <span className={`font-semibold ${moodInfo.color}`}>
                  {moodInfo.emoji} {moodScore}/10 — {moodInfo.label}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={moodScore}
                onChange={(e) => setMoodScore(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500"
              />
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>1 (Struggling)</span>
                <span>5 (Steady)</span>
                <span>10 (Thriving)</span>
              </div>
            </div>

            {/* 2. Craving Intensity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500" /> Craving Urge Level
                </span>
                <span className={`font-semibold ${cravingInfo.color}`}>
                  {cravingScore}/10 — {cravingInfo.label}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={cravingScore}
                onChange={(e) => setCravingScore(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500"
              />
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>1 (Zero urge)</span>
                <span>5 (Manageable)</span>
                <span>10 (Overwhelming)</span>
              </div>
            </div>

            {/* 3. Energy Level Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" /> Energy & Vitality
                </span>
                <span className="font-semibold text-amber-500">{energyLevel}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-slate-600 via-amber-400 to-emerald-400"
              />
            </div>

            {/* 4. Feeling Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium">How are you feeling right now?</label>
              <div className="flex flex-wrap gap-1.5">
                {FEELING_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        active
                          ? 'bg-primary text-primary-foreground border-primary font-medium'
                          : 'bg-muted/50 hover:bg-muted text-muted-foreground border-border'
                      }`}
                    >
                      {active && <Check className="w-3 h-3 inline mr-1" />}
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 5. Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Daily Reflection & Wins (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What went well today? What triggered you, or what are you proud of?"
                rows={3}
                className="w-full text-sm rounded-xl border border-input bg-background/50 p-3 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 gap-2 font-medium">
                {loading ? 'Saving...' : 'Save Check-In'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
