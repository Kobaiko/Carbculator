import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { MenuItems } from './MenuItems';
import { MenuHeader } from './MenuHeader';

interface SideMenuProps {
  activeTab: string;
  onTabChange: (tab: 'dashboard' | 'meals' | 'goals' | 'calendar' | 'water' | 'profile') => void;
}

export function SideMenu({ activeTab, onTabChange }: SideMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Mobile menu button - positioned relative to content */}
      <div className="lg:hidden sticky top-0 z-50 bg-brand-50 dark:bg-brand-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="py-4 flex items-center justify-between">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                'bg-white dark:bg-brand-800',
                'text-brand-600 dark:text-brand-300',
                'hover:bg-brand-50 dark:hover:bg-brand-700',
                'border border-brand-200 dark:border-brand-700'
              )}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-lg font-semibold text-brand-700 dark:text-brand-300">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side menu */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full z-50 transition-all duration-300',
          'bg-white/95 dark:bg-brand-800/90 backdrop-blur-md',
          'border-r border-brand-100 dark:border-brand-700',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'w-64 lg:w-20 lg:hover:w-64'
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="h-full flex flex-col p-4">
          <MenuHeader isExpanded={isExpanded || isOpen} />
          <MenuItems
            activeTab={activeTab}
            onTabChange={(tab) => {
              onTabChange(tab);
              setIsOpen(false);
            }}
            isExpanded={isExpanded || isOpen}
          />
        </div>
      </aside>
    </>
  );
}