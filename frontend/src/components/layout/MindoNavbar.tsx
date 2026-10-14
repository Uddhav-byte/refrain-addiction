import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Stethoscope,
  Video,
  TrendingUp,
  Settings as SettingsIcon,
  Bell,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MindoNavbarProps {
  activeTab?: 'dashboard' | 'psychiatrist' | 'session' | 'progress';
  onTabChange?: (tab: 'dashboard' | 'psychiatrist' | 'session' | 'progress') => void;
  onOpenSessionModal?: () => void;
}

export const MindoNavbar: React.FC<MindoNavbarProps> = ({
  activeTab = 'dashboard',
  onTabChange,
  onOpenSessionModal,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showPsychiatristModal, setShowPsychiatristModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2);

  const psychiatrists = [
    {
      name: 'Dr. Jasmin Vance',
      role: 'Clinical Psychologist, CBT Specialist',
      experience: '12 years exp.',
      rating: '4.9 ★ (340 reviews)',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=160&auto=format&fit=crop&q=80',
      availability: 'Available Today, 4:00 PM',
      focus: 'Cognitive Behavioral Therapy & Craving Reframing',
    },
    {
      name: 'Dr. David Jonshon',
      role: 'Neuropsychiatrist & Addiction Specialist',
      experience: '15 years exp.',
      rating: '5.0 ★ (512 reviews)',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=160&auto=format&fit=crop&q=80',
      availability: 'Available Tomorrow, 10:30 AM',
      focus: 'Dopamine Regulation & Stress Management',
    },
    {
      name: 'Dr. Samira Al-Mansoor',
      role: 'Behavioral Sleep & Somatic Therapist',
      experience: '9 years exp.',
      rating: '4.8 ★ (280 reviews)',
      avatar: 'https://images.unsplash.com/photo-1594824813583-b78b0f9f30b9?w=160&auto=format&fit=crop&q=80',
      availability: 'Available Friday, 2:00 PM',
      focus: 'Sleep Hygiene & Nervous System Regulation',
    },
  ];

  const handleTabClick = (tab: 'dashboard' | 'psychiatrist' | 'session' | 'progress') => {
    if (tab === 'psychiatrist') {
      setShowPsychiatristModal(true);
    } else if (tab === 'session') {
      if (onOpenSessionModal) {
        onOpenSessionModal();
      } else {
        navigate('/urge-log');
      }
    } else if (tab === 'progress') {
      if (onTabChange) {
        onTabChange('progress');
      } else {
        navigate('/dashboard');
      }
    } else {
      if (onTabChange) {
        onTabChange('dashboard');
      }
      navigate('/dashboard');
    }
  };

  return (
    <>
      <header className="w-full px-4 sm:px-8 pt-5 pb-3 flex items-center justify-between sticky top-0 z-40 bg-[#F2EFFE]/90 backdrop-blur-md transition-all">
        {/* Brand / Logo */}
        <div 
          onClick={() => {
            if (onTabChange) onTabChange('dashboard');
            navigate('/dashboard');
          }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
              Mindo
            </span>
            <span className="text-[10px] uppercase font-semibold text-purple-700/70 tracking-wider hidden sm:inline">
              Refrain Platform
            </span>
          </div>
        </div>

        {/* Center Floating Pill Navigation */}
        <nav className="flex items-center bg-white/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-purple-100/80 rounded-full p-1 sm:p-1.5 transition-all">
          {/* Dashboard */}
          <button
            type="button"
            onClick={() => handleTabClick('dashboard')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white text-slate-900 shadow-sm border border-purple-100 font-semibold'
                : 'text-slate-500 hover:text-slate-900 hover:bg-purple-50/50'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-slate-700" />
            <span>Dashboard</span>
          </button>

          {/* Psychiatrist */}
          <button
            type="button"
            onClick={() => handleTabClick('psychiatrist')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'psychiatrist'
                ? 'bg-white text-slate-900 shadow-sm border border-purple-100 font-semibold'
                : 'text-slate-500 hover:text-slate-900 hover:bg-purple-50/50'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Psychiatrist</span>
          </button>

          {/* Session */}
          <button
            type="button"
            onClick={() => handleTabClick('session')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'session'
                ? 'bg-white text-slate-900 shadow-sm border border-purple-100 font-semibold'
                : 'text-slate-500 hover:text-slate-900 hover:bg-purple-50/50'
            }`}
          >
            <Video className="w-4 h-4 text-slate-500" />
            <span>Session</span>
          </button>

          {/* Progress */}
          <button
            type="button"
            onClick={() => handleTabClick('progress')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'progress'
                ? 'bg-white text-slate-900 shadow-sm border border-purple-100 font-semibold'
                : 'text-slate-500 hover:text-slate-900 hover:bg-purple-50/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Progress</span>
          </button>
        </nav>

        {/* Right Section: Settings, Notifications & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Settings Button */}
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            aria-label="Settings"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-purple-100/90 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-purple-50/60 transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Notification Button */}
          <button
            type="button"
            onClick={() => {
              setShowNotificationsModal(true);
              setNotificationCount(0);
            }}
            aria-label="Notifications"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-purple-100/90 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-purple-50/60 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-600 ring-2 ring-white" />
            )}
          </button>

          {/* User Profile Avatar */}
          <div
            onClick={() => navigate('/profile')}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-purple-200/80 overflow-hidden cursor-pointer shadow-sm hover:scale-105 transition-transform"
            title={user?.full_name || 'Sara'}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
              alt={user?.full_name || 'Sara'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Psychiatrist Modal */}
      <Dialog open={showPsychiatristModal} onOpenChange={setShowPsychiatristModal}>
        <DialogContent className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-purple-600 text-xs font-semibold uppercase tracking-wider mb-1">
              <Stethoscope className="w-4 h-4" />
              Certified Clinical Network
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Consult with a Mental Health Specialist
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Connect with specialized psychiatrists and behavioral therapists to support your recovery.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
            {psychiatrists.map((doc, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-purple-100 bg-[#FAF9FF] hover:bg-purple-50/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-200"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-base">{doc.name}</h4>
                    <p className="text-xs text-purple-700 font-medium">{doc.role}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{doc.focus}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>{doc.rating}</span>
                      <span>•</span>
                      <span>{doc.experience}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {doc.availability}
                  </span>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 text-xs font-semibold shadow-sm"
                    onClick={() => {
                      alert(`Booking requested with ${doc.name}! A calendar invitation has been sent.`);
                      setShowPsychiatristModal(false);
                    }}
                  >
                    Book Session
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="max-w-md bg-white rounded-3xl p-6 border border-purple-100 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-purple-600" />
              Settings & Preferences
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Customize your Mindo wellness journey & recovery controls.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">Daily Check-In Reminders</p>
                <p className="text-xs text-slate-500">Notify you at 8:00 PM every evening</p>
              </div>
              <span className="text-xs font-bold text-purple-600 bg-white px-2.5 py-1 rounded-full shadow-xs">
                Enabled
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">Privacy & Row Level Security</p>
                <p className="text-xs text-slate-500">End-to-end user isolation active</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">Active User Profile</p>
                <p className="text-xs text-slate-500">{user?.email || 'sara.wellness@refrain.app'}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs border-purple-200 text-purple-700 hover:bg-purple-100"
                onClick={() => {
                  setShowSettingsModal(false);
                  navigate('/profile');
                }}
              >
                Edit
              </Button>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-slate-600"
                onClick={() => setShowSettingsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Modal */}
      <Dialog open={showNotificationsModal} onOpenChange={setShowNotificationsModal}>
        <DialogContent className="max-w-md bg-white rounded-3xl p-6 border border-purple-100 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" />
              Recent Notifications
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-3">
            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-800">80%+ Health Improvement Peak</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Your focus power and urge regulation reached its weekly peak on Friday, 6 Aug.
                </p>
                <span className="text-[10px] text-purple-600 font-medium mt-1 inline-block">2 hours ago</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#FBFBFF] border border-purple-100/70 flex items-start gap-3">
              <Clock className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-800">Upcoming Session in 6h 52m</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Scheduled mindfulness & urge-resistance check-in with Dr. Jasmin.
                </p>
                <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">Today</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
