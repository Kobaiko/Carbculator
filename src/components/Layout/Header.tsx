import React from 'react';
import { AppleLogo } from '../Logo/AppleLogo';
import { ThemeToggle } from '../UI/ThemeToggle';

export function Header() {
  return (
    <div className="bg-gradient-to-b from-brand-100 to-white dark:from-brand-800 dark:to-brand-900 shadow-sm transition-colors">
      <div className="max-w-3xl mx-auto py-6 px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10">
              <AppleLogo />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-brand-700 dark:text-brand-300">
                Carbculator
              </h1>
              <ThemeToggle />
            </div>
          </div>
          <p className="text-brand-600 dark:text-brand-400 font-medium text-center">
            Snap your meal, get instant nutrition insights
          </p>
        </div>
      </div>
    </div>
  );
}