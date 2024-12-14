import React from 'react';
import { GlassWater } from 'lucide-react';

interface WaterSummaryProps {
  consumed: number;
  goal: number;
}

export function WaterSummary({ consumed, goal }: WaterSummaryProps) {
  const percentage = Math.min(100, (consumed / goal) * 100);

  return (
    <div className="bg-white dark:bg-brand-800/30 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <GlassWater className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
          Water Intake
        </span>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-brand-600 dark:text-brand-400">Goal</span>
          <span className="text-brand-700 dark:text-brand-300 font-medium">
            {goal}ml
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-brand-600 dark:text-brand-400">Consumed</span>
          <span className="text-brand-700 dark:text-brand-300 font-medium">
            {consumed}ml
          </span>
        </div>
        <div className="h-2 bg-brand-100 dark:bg-brand-800 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}