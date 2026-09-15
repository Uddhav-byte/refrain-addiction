import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Pages
import Landing from '@/pages/Landing';
import LoginPage from '@/components/auth/LoginPage';
import RegisterPage from '@/components/auth/RegisterPage';
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
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AssessmentPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/urges"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <UrgeLogPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Community />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Toaster 
            position="bottom-right"
            toastOptions={{
              className: 'dark:bg-slate-800 dark:text-slate-100',
              style: {
                borderRadius: '10px',
                background: 'var(--card)',
                color: 'var(--card-foreground)',
              },
            }} 
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
