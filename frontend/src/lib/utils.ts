import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date?: string | Date | null, formatStr?: string): string {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  if (formatStr === 'yyyy') {
    return d.getFullYear().toString()
  }
  if (formatStr === 'MMM d') {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d)
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

export function formatRelativeTime(date: string | Date): string {
  if (!date) return ''
  const now = new Date()
  const then = new Date(date)
  if (isNaN(then.getTime())) return ''

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const diffInMs = then.getTime() - now.getTime()
  const diffInSecs = Math.round(diffInMs / 1000)
  const diffInMins = Math.round(diffInSecs / 60)
  const diffInHours = Math.round(diffInMins / 60)
  const diffInDays = Math.round(diffInHours / 24)

  if (Math.abs(diffInDays) > 0) return rtf.format(diffInDays, 'day')
  if (Math.abs(diffInHours) > 0) return rtf.format(diffInHours, 'hour')
  if (Math.abs(diffInMins) > 0) return rtf.format(diffInMins, 'minute')
  return rtf.format(diffInSecs, 'second')
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
