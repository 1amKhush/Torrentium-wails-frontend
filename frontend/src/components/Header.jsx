import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ArrowRightLeft, Clock, Shield, UserCircle, Trophy, Settings, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

const navigationItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/transfers', icon: ArrowRightLeft, label: 'Transfers' },
  { to: '/history', icon: Clock, label: 'History' },
  { to: '/network', icon: Shield, label: 'Private Network' },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/premium', icon: Sparkles, label: 'Premium' },
];

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-background font-bold text-sm">T</span>
          </div>
          <span className="font-semibold text-xl">Torrentium</span>
        </div>
        <nav className="hidden md:flex items-center space-x-2">
          {navigationItems.map((item) => (
            <Button asChild variant="ghost" key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => cn(isActive && 'text-primary')}>
                <item.icon className="h-5 w-5 mr-2" />
                {item.label}
              </NavLink>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}