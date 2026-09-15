import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ClipboardCheck, Activity, MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Assessment', path: '/assessment', icon: ClipboardCheck },
  { name: 'Urge Log', path: '/urge-log', icon: Activity },
  { name: 'Community', path: '/community', icon: MessageCircle },
  { name: 'Profile', path: '/profile', icon: User },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border bg-card pb-safe md:hidden px-2">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "relative flex flex-col items-center justify-center w-full h-full text-xs transition-colors",
            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute top-0 w-12 h-1 bg-primary rounded-b-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className="w-6 h-6 mb-1" />
              <span className="truncate w-full text-center">{item.name}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
