import React from 'react';
import { clsx } from 'clsx';
import type { Timeframe } from '../../types/dashboard';

interface TimeframeSelectorProps {
  selected: Timeframe;
  onChange: (timeframe: Timeframe) => void;
}

const timeframes: { value: Timeframe; label: string }[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

export function TimeframeSelector({ selected, onChange }: TimeframeSelectorProps) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-brand-200 dark:border-brand-700">
      {timeframes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={clsx(
            'px-4 py-2 text-sm font-medium transition-colors',
            selected === value
              ? 'bg-brand-500 text-white dark:bg-brand-400 dark:text-brand-900'
              : 'bg-white text-brand-600 hover:bg-brand-50 dark:bg-brand-800 dark:text-brand-400 dark:hover:bg-brand-700'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}