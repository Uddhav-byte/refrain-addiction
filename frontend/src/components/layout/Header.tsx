import React from 'react';
import { Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useLocation } from 'react-router-dom';

const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/assessment': 'Assessment',
  '/urge-log': 'Urge Log',
  '/community': 'Community',
  '/profile': 'Profile',
};

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const title = routeTitles[location.pathname] || 'Refrain';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-sm hidden md:flex">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun className="w-5 h-5 text-muted-foreground" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
        </Button>
        <Avatar className="w-8 h-8 flex items-center justify-center bg-primary/20 text-primary font-medium cursor-pointer rounded-full overflow-hidden">
          {user?.name?.charAt(0) || 'U'}
        </Avatar>
      </div>
    </header>
  );
}
