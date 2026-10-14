import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UrgeSurfingModal } from '../../components/urge/UrgeSurfingModal'
import { AuthProvider } from '../../lib/auth'
import { localRepo } from '../../lib/supabase'

function renderModal(props = { isOpen: true, onClose: vi.fn() }) {
  return render(
    <AuthProvider>
      <UrgeSurfingModal {...props} />
    </AuthProvider>
  )
}

describe('UrgeSurfingModal Component Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localRepo.ensureDemoUser()
    vi.clearAllMocks()
  })

  it('renders modal with breathing orb, timer, and mindful mantras', () => {
    renderModal()

    expect(screen.getByText(/Urge Surfing Station/i)).toBeInTheDocument()
    expect(screen.getByText(/inhale/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /I Surfed the Urge!/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Log Details/i })).toBeInTheDocument()
  })

  it('does not render anything when isOpen is false', () => {
    const { container } = renderModal({ isOpen: false, onClose: vi.fn() })
    expect(container).toBeEmptyDOMElement()
  })

  it('calls onClose when close icon is clicked', () => {
    const onClose = vi.fn()
    renderModal({ isOpen: true, onClose })

    const closeBtn = screen.getByLabelText(/Exit Urge Surfing/i)
    fireEvent.click(closeBtn)

    expect(onClose).toHaveBeenCalled()
  })

  it('toggles audio chime setting', () => {
    renderModal()

    const audioBtn = screen.getByTitle(/Enable calming chimes/i)
    fireEvent.click(audioBtn)

    expect(screen.getByTitle(/Mute audio/i)).toBeInTheDocument()
  })

  it('navigates directly to log form when "Log Details" is clicked', async () => {
    renderModal()

    const logDetailsBtn = screen.getByRole('button', { name: /Log Details/i })
    fireEvent.click(logDetailsBtn)

    expect(screen.getByText(/Log This Craving Episode/i)).toBeInTheDocument()
    expect(screen.getByText(/Intensity/i)).toBeInTheDocument()
  })

  it('handles "I Surfed the Urge!" victory button and transitions to logging form', async () => {
    renderModal()

    const surfBtn = screen.getByRole('button', { name: /I Surfed the Urge!/i })
    fireEvent.click(surfBtn)

    // Wait for the transition timeout
    await waitFor(() => {
      expect(screen.getByText(/Log This Craving Episode/i)).toBeInTheDocument()
    }, { timeout: 2500 })
  })

  it('can submit urge log form and close modal', async () => {
    const onClose = vi.fn()
    renderModal({ isOpen: true, onClose })

    // Open log details
    fireEvent.click(screen.getByRole('button', { name: /Log Details/i }))

    // Select a trigger tag
    const stressTrigger = screen.getByText('Stress')
    fireEvent.click(stressTrigger)

    // Submit log
    const submitBtn = screen.getByRole('button', { name: /Save Log/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })
})
