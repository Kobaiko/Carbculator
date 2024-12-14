import React from 'react';
import { AppleLogo } from '../Logo/AppleLogo';
import { ThemeToggle } from '../UI/ThemeToggle';
import { clsx } from 'clsx';

interface MenuHeaderProps {
  isExpanded: boolean;
}

export function MenuHeader({ isExpanded }: MenuHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12">
          <AppleLogo />
        </div>
      </div>
      <div
        className={clsx(
          'flex items-center justify-between transition-opacity duration-200',
          isExpanded ? 'opacity-100' : 'opacity-0'
        )}
      >
        <h1 className="text-xl font-bold text-brand-300">
          Carbculator
        </h1>
        <ThemeToggle />
      </div>
    </div>
  );
}