import React from 'react';
import type { MacroGoals } from '../../types/goals';

interface MacroSummaryProps {
  consumed: MacroGoals;
  goals: MacroGoals;
}

export function MacroSummary({ consumed, goals }: MacroSummaryProps) {
  const calculatePercentage = (consumed: number, goal: number) => {
    return Math.min(100, Math.round((consumed / goal) * 100));
  };

  const macros = [
    {
      label: 'Calories',
      consumed: consumed.calories,
      goal: goals.calories,
      unit: 'kcal',
      icon: '🔥'
    },
    {
      label: 'Protein',
      consumed: consumed.protein,
      goal: goals.protein,
      unit: 'g',
      icon: '🥩'
    },
    {
      label: 'Fat',
      consumed: consumed.fat,
      goal: goals.fat,
      unit: 'g',
      icon: '💧'
    },
    {
      label: 'Carbs',
      consumed: consumed.carbs,
      goal: goals.carbs,
      unit: 'g',
      icon: '🍪'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {macros.map(({ label, consumed: value, goal, unit, icon }) => (
        <div
          key={label}
          className="bg-white dark:bg-brand-800/30 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{icon}</span>
            <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
              {label}
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-brand-600 dark:text-brand-400">Goal</span>
              <span className="text-brand-700 dark:text-brand-300 font-medium">
                {goal} {unit}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-brand-600 dark:text-brand-400">Consumed</span>
              <span className="text-brand-700 dark:text-brand-300 font-medium">
                {value} {unit}
              </span>
            </div>
            <div className="h-2 bg-brand-100 dark:bg-brand-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-brand-500 dark:bg-brand-400 transition-all duration-300"
                style={{
                  width: `${calculatePercentage(value, goal)}%`
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}