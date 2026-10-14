import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Pages
import Landing from '@/pages/Landing';
import { LoginPage } from '@/components/auth/LoginPage';
import { RegisterPage } from '@/components/auth/RegisterPage';
import Dashboard from '@/pages/Dashboard';
import AssessmentPage from '@/pages/Assessment';
import UrgeLogPage from '@/pages/UrgeLog';
import Community from '@/pages/Community';
import Profile from '@/pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Primary View: Flagship Mindo Mental Wellness Dashboard */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Public and Supplementary Pages */}
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Feature Routes */}
            <Route
              path="/assessment"
              element={
                <ProtectedRoute>
                  <AssessmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/urge-log"
              element={
                <ProtectedRoute>
                  <UrgeLogPage />
                </ProtectedRoute>
              }
            />
            {/* Route alias for backward compatibility */}
            <Route
              path="/urges"
              element={<Navigate to="/urge-log" replace />}
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Toaster 
            position="bottom-right"
            toastOptions={{
              className: 'shadow-xl border border-purple-100',
              style: {
                borderRadius: '16px',
                background: '#FFFFFF',
                color: '#1E1B2E',
                border: '1px solid #EDE9FE',
              },
            }} 
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
