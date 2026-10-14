import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MindoNavbar } from './MindoNavbar';
import { MobileNav } from './MobileNav';
import { UrgeSurfingModal } from '@/components/urge/UrgeSurfingModal';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUrgeSurfing, setShowUrgeSurfing] = useState(false);

  // Map route to activeTab
  let activeTab: 'dashboard' | 'psychiatrist' | 'session' | 'progress' = 'dashboard';
  if (location.pathname === '/assessment') {
    activeTab = 'progress';
  } else if (location.pathname === '/urge-log' || location.pathname === '/urges') {
    activeTab = 'session';
  } else {
    activeTab = 'dashboard';
  }

  const handleTabChange = (tab: 'dashboard' | 'psychiatrist' | 'session' | 'progress') => {
    if (tab === 'dashboard') {
      navigate('/dashboard');
    } else if (tab === 'session') {
      setShowUrgeSurfing(true);
    } else if (tab === 'progress') {
      navigate('/assessment');
    }
  };

  return (
    <div className="min-h-screen bg-[#F2EFFE] flex flex-col font-sans antialiased text-slate-800">
      {/* Mindo Top Navigation Bar matching reference design */}
      <MindoNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenSessionModal={() => setShowUrgeSurfing(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children || <Outlet />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Urge Surfing SOS Modal */}
      <UrgeSurfingModal
        isOpen={showUrgeSurfing}
        onClose={() => setShowUrgeSurfing(false)}
      />
    </div>
  );
}
