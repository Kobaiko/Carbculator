import React from 'react';
import { clsx } from 'clsx';

interface PercentageTextProps {
  percentage: number;
}

export function PercentageText({ percentage }: PercentageTextProps) {
  const displayPercentage = Math.round(percentage);
  const isOverflowing = percentage > 100;
  
  return (
    <>
      {/* Background circle for better contrast */}
      {percentage > 0 && percentage < 63 && (
        <circle
          cx="60"
          cy="82"
          r="18"
          fill="white"
          className="dark:fill-blue-900"
          opacity="0.9"
        />
      )}
      
      {/* Percentage text */}
      <text
        x="60"
        y="85"
        textAnchor="middle"
        dominantBaseline="middle"
        className={clsx(
          'text-2xl font-bold',
          percentage === 0 && 'opacity-0',
          percentage < 63 ? 'fill-blue-600 dark:fill-blue-400' : 'fill-white',
          isOverflowing && 'fill-white'
        )}
      >
        {percentage > 0 ? `${displayPercentage}%` : ''}
      </text>
    </>
  );
}