import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { DashboardPage } from '../../components/dashboard/DashboardPage'
import { AuthProvider } from '../../lib/auth'
import { localRepo } from '../../lib/supabase'

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Dashboard Component Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localRepo.ensureDemoUser()
  })

  it('renders Dashboard with user greeting and recovery metrics', async () => {
    renderWithProviders(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/Urges Resisted/i)).toBeInTheDocument()
    expect(screen.getByText(/Days Tracked/i)).toBeInTheDocument()
    expect(screen.getByText(/Relapse Vulnerability/i)).toBeInTheDocument()
  })

  it('displays quick action buttons for Urge Surfing SOS and Daily Check-In', async () => {
    renderWithProviders(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/Urge Surfing SOS/i)).toBeInTheDocument()
      expect(screen.getByText(/Log Daily Check-in/i)).toBeInTheDocument()
    })
  })

  it('displays Milestones and Achievement badges section', async () => {
    renderWithProviders(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/Milestones & Achievements/i)).toBeInTheDocument()
      expect(screen.getByText(/First Step/i)).toBeInTheDocument()
    })
  })
})
