import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, LayoutDashboard, ClipboardCheck, Activity, MessageCircle, User, ChevronLeft, ChevronRight, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Assessment', path: '/assessment', icon: ClipboardCheck },
  { name: 'Urge Log', path: '/urge-log', icon: Activity },
  { name: 'Community', path: '/community', icon: MessageCircle },
  { name: 'Profile', path: '/profile', icon: User },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
      className="fixed left-0 top-0 h-screen bg-card border-r border-border hidden md:flex flex-col z-40"
    >
      <div className={cn("flex h-16 items-center border-b border-border transition-all duration-300", isCollapsed ? "justify-center" : "justify-between px-4")}>
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <Leaf className="w-8 h-8 text-primary shrink-0" />
          {!isCollapsed && <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Refrain</span>}
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-1.5 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 py-2.5 rounded-lg font-medium text-sm transition-all overflow-hidden",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed ? "justify-center px-0" : "px-3"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border flex flex-col gap-4">
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && <span className="text-sm font-medium">Dark Mode</span>}
          <div className="flex items-center gap-2">
            {!isCollapsed && <Sun className="w-4 h-4 text-muted-foreground shrink-0" />}
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} aria-label="Toggle theme" />
            {!isCollapsed && <Moon className="w-4 h-4 text-muted-foreground shrink-0" />}
          </div>
        </div>

        <Button
          variant="ghost"
          className={cn(
            "w-full flex items-center text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors",
            isCollapsed ? "justify-center px-0" : "justify-start gap-3 px-3"
          )}
          onClick={() => logout()}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="self-center mt-1 text-muted-foreground hover:text-foreground"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
    </motion.aside>
  );
}
