import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  ArrowRightLeft, 
  Clock, 
  Shield, 
  UserCircle, 
  Trophy, 
  Menu,
  X,
  Settings,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

const navigationItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/transfers', icon: ArrowRightLeft, label: 'Transfers' },
  { to: '/history', icon: Clock, label: 'History' },
  { to: '/network', icon: Shield, label: 'Private Network' },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
];

const bottomItems = [
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/premium', icon: Sparkles, label: 'Premium' },
];

export function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setIsHovered(false), 100);
    setHoverTimeout(timeout);
  };

  const isExpanded = isHovered || isMobileOpen;

  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-surface border border-background"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      <div 
        className={cn(
          "fixed left-0 top-0 h-full bg-surface border-r border-background z-40 transition-all duration-300 ease-out",
          "flex flex-col group overflow-hidden",
          isMobileOpen ? "w-64 translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:w-16 md:hover:w-64"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center p-3 border-b border-background min-h-[65px] flex-shrink-0">
          <div className={cn(
            "flex items-center transition-all duration-300",
            isExpanded ? "space-x-3" : "justify-center w-full"
          )}>
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-background font-bold text-xs">T</span>
            </div>
            {isExpanded && (
              <span className="font-semibold text-base whitespace-nowrap text-text">
                Torrentium
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => cn(
                    "flex items-center h-10 transition-colors duration-200 group relative rounded-lg",
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-text-secondary hover:bg-background hover:text-text",
                    isExpanded ? "px-3 justify-start" : "justify-center w-10 mx-auto"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {isExpanded && <span className="ml-3 font-medium whitespace-nowrap">{item.label}</span>}
                  {!isExpanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-surface border border-background rounded text-xs shadow-lg z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:delay-500">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 border-t border-background flex-shrink-0">
          <ul className="space-y-2">
            {bottomItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => cn(
                    "flex items-center h-10 transition-colors duration-200 group relative rounded-lg",
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-text-secondary hover:bg-background hover:text-text",
                    isExpanded ? "px-3 justify-start" : "justify-center w-10 mx-auto"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {isExpanded && <span className="ml-3 font-medium whitespace-nowrap">{item.label}</span>}
                  {!isExpanded && (
                     <div className="absolute left-full ml-2 px-2 py-1 bg-surface border border-background rounded text-xs shadow-lg z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:delay-500">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}