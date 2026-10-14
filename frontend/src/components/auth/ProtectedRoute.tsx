import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { AppLayout } from '../layout/AppLayout';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, loginDemo } = useAuth();

  useEffect(() => {
    // Automatically initialize demo session if visiting without credentials
    // ensuring the deployed dashboard works out of the box
    if (!isLoading && !isAuthenticated) {
      loginDemo();
    }
  }, [isLoading, isAuthenticated, loginDemo]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F2EFFE] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg shadow-sm animate-pulse">
          M
        </div>
        <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
        <span className="text-xs text-purple-800 font-medium">Loading Mindo Wellness...</span>
      </div>
    );
  }

  return (
    <AppLayout>
      {children || <Outlet />}
    </AppLayout>
  );
}
