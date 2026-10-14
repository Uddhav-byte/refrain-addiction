import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MoodLogModal } from '../../components/dashboard/MoodLogModal'
import { AuthProvider } from '../../lib/auth'
import { localRepo } from '../../lib/supabase'

function renderModal(props = { isOpen: true, onClose: vi.fn(), onSuccess: vi.fn() }) {
  return render(
    <AuthProvider>
      <MoodLogModal {...props} />
    </AuthProvider>
  )
}

describe('MoodLogModal Component Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localRepo.ensureDemoUser()
  })

  it('renders modal with title and mood assessment sliders when open', () => {
    renderModal()

    expect(screen.getByText(/Daily Recovery Check-In/i)).toBeInTheDocument()
    expect(screen.getByText(/Overall Mood/i)).toBeInTheDocument()
    expect(screen.getByText(/Craving Urge Level/i)).toBeInTheDocument()
    expect(screen.getByText(/Energy & Vitality/i)).toBeInTheDocument()
  })

  it('renders interactive emotion feeling tags', () => {
    renderModal()

    expect(screen.getByText('Calm')).toBeInTheDocument()
    expect(screen.getByText('Grateful')).toBeInTheDocument()
    expect(screen.getByText('Focused')).toBeInTheDocument()

    // Toggle tag
    const gratefulBtn = screen.getByText('Grateful')
    fireEvent.click(gratefulBtn)
    expect(gratefulBtn).toBeInTheDocument()
  })

  it('submits check-in and triggers success callback', async () => {
    const onSuccess = vi.fn()
    const onClose = vi.fn()
    renderModal({ isOpen: true, onClose, onSuccess })

    const notesInput = screen.getByPlaceholderText(/What went well today/i)
    fireEvent.change(notesInput, { target: { value: 'Great day, felt very productive and calm.' } })

    const submitBtn = screen.getByRole('button', { name: /Save Check-In/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('does not render when isOpen is false', () => {
    renderModal({ isOpen: false, onClose: vi.fn(), onSuccess: vi.fn() })
    expect(screen.queryByText(/Daily Recovery Check-In/i)).not.toBeInTheDocument()
  })
})
