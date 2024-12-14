import React from 'react';
import { BarChart3, UtensilsCrossed, Target, Calendar, GlassWater, User } from 'lucide-react';
import { clsx } from 'clsx';
import { useProfile } from '../../hooks/useProfile';

interface MenuItemsProps {
  activeTab: string;
  onTabChange: (tab: 'dashboard' | 'meals' | 'goals' | 'calendar' | 'water' | 'profile') => void;
  isExpanded: boolean;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'meals', label: 'Daily Meals', icon: UtensilsCrossed },
  { id: 'goals', label: 'Daily Goals', icon: Target },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'water', label: 'Water Intake', icon: GlassWater },
] as const;

export function MenuItems({ activeTab, onTabChange, isExpanded }: MenuItemsProps) {
  const { profile } = useProfile();

  return (
    <nav className="flex flex-col justify-between h-full">
      <div className="space-y-2">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id as any)}
            className={clsx(
              'w-full flex items-center gap-3 p-3 rounded-lg transition-colors',
              'hover:bg-brand-50 dark:hover:bg-brand-700/50',
              activeTab === id
                ? 'bg-brand-50 dark:bg-brand-700/50 text-brand-600 dark:text-brand-300'
                : 'text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300'
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span
              className={clsx(
                'text-sm font-medium whitespace-nowrap transition-all duration-300',
                isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 hidden lg:block'
              )}
            >
              {label}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={() => onTabChange('profile')}
        className={clsx(
          'w-full flex items-center gap-3 p-3 rounded-lg transition-colors mt-auto',
          'hover:bg-brand-50 dark:hover:bg-brand-700/50',
          activeTab === 'profile'
            ? 'bg-brand-50 dark:bg-brand-700/50 text-brand-600 dark:text-brand-300'
            : 'text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300'
        )}
      >
        {profile.imageUrl ? (
          <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={profile.imageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <User className="h-5 w-5 flex-shrink-0" />
        )}
        <span
          className={clsx(
            'text-sm font-medium whitespace-nowrap transition-all duration-300',
            isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 hidden lg:block'
          )}
        >
          Profile
        </span>
      </button>
    </nav>
  );
}