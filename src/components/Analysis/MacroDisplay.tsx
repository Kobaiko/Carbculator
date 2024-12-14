import React from 'react';
import { type MacroNutrients } from '../../types/food';
import { Flame, Beef, Droplet, Cookie } from 'lucide-react';

interface MacroDisplayProps {
  macros: MacroNutrients;
}

export function MacroDisplay({ macros }: MacroDisplayProps) {
  const stats = [
    { label: 'Calories', value: macros.calories, unit: 'kcal', icon: Flame, color: 'text-brand-500 dark:text-brand-400' },
    { label: 'Protein', value: macros.protein, unit: 'g', icon: Beef, color: 'text-brand-600 dark:text-brand-300' },
    { label: 'Fat', value: macros.fat, unit: 'g', icon: Droplet, color: 'text-brand-500 dark:text-brand-400' },
    { label: 'Carbs', value: macros.carbs, unit: 'g', icon: Cookie, color: 'text-brand-600 dark:text-brand-300' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ label, value, unit, icon: Icon, color }) => (
        <div
          key={label}
          className="bg-brand-50 dark:bg-brand-800/50 rounded-lg p-4 text-center transition-colors"
        >
          <Icon className={`mx-auto h-6 w-6 ${color}`} />
          <p className="text-brand-600 dark:text-brand-300 text-sm mt-2">{label}</p>
          <p className="text-brand-700 dark:text-brand-200 text-2xl font-bold mt-1">
            {value}
            <span className="text-brand-500 dark:text-brand-400 text-sm ml-1">{unit}</span>
          </p>
        </div>
      ))}
    </div>
  );
}