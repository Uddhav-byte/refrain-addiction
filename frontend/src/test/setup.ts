import '@testing-library/jest-dom'
import { vi } from 'vitest'

// LocalStorage Mock
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value ? value.toString() : ''
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    key: (index: number) => Object.keys(store)[index] || null,
    get length() {
      return Object.keys(store).length
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}))

// Mock scrollIntoView
if (typeof window !== 'undefined' && window.HTMLElement) {
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
}

// Suppress unhandled AbortError rejections caused by happy-dom's Web Animations implementation
if (typeof window !== 'undefined' && window.Element && window.Element.prototype.animate) {
  const originalAnimate = window.Element.prototype.animate
  window.Element.prototype.animate = function (keyframes: Keyframe[] | PropertyIndexedKeyframes | null, options?: number | KeyframeAnimationOptions) {
    const animation = originalAnimate.call(this, keyframes, options)
    if (animation && animation.finished && typeof animation.finished.catch === 'function') {
      animation.finished.catch(() => {})
    }
    return animation
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.name === 'AbortError' || event.reason?.message?.includes?.('The animation was canceled')) {
      event.preventDefault()
    }
  })
}

process.on('unhandledRejection', (reason: any) => {
  if (reason?.name === 'AbortError' || reason?.message?.includes?.('The animation was canceled')) {
    // Expected benign cancellation from framer-motion DOM animations during unmount in happy-dom
    return
  }
})

