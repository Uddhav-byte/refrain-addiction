import { useState } from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useLocation, useNavigate } from 'react-router-dom';
import { MoodLogModal } from '@/components/dashboard/MoodLogModal';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Recovery Dashboard',
  '/': 'Recovery Dashboard',
  '/assessment': 'Behavioral Assessment',
  '/urge-log': 'Urge Log & Trends',
  '/urges': 'Urge Log & Trends',
  '/community': 'Community Peer Support',
  '/profile': 'Profile & Journey Stats',
};

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMoodModal, setShowMoodModal] = useState(false);

  const title = routeTitles[location.pathname] || 'Refrain Recovery';

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-sm hidden md:flex">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMoodModal(true)}
            className="gap-1.5 text-xs font-medium border-primary/30 text-primary hover:bg-primary/10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            + Check-In
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-muted-foreground" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
          </Button>

          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 cursor-pointer p-1 pr-3 rounded-full hover:bg-muted/80 transition-colors"
            title="View Profile"
          >
            <Avatar className="w-8 h-8 flex items-center justify-center bg-primary/20 text-primary font-bold text-xs rounded-full overflow-hidden">
              {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </Avatar>
            <span className="text-xs font-semibold text-foreground max-w-[120px] truncate">
              {user?.full_name || user?.username || 'Profile'}
            </span>
          </div>
        </div>
      </header>

      <MoodLogModal
        isOpen={showMoodModal}
        onClose={() => setShowMoodModal(false)}
      />
    </>
  );
}
