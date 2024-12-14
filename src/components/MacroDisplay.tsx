import React from 'react';
import { type MacroNutrients } from '../types/food';

interface MacroDisplayProps {
  macros: MacroNutrients;
}

export function MacroDisplay({ macros }: MacroDisplayProps) {
  const stats = [
    { label: 'Calories', value: macros.calories, unit: 'kcal' },
    { label: 'Protein', value: macros.protein, unit: 'g' },
    { label: 'Fat', value: macros.fat, unit: 'g' },
    { label: 'Carbs', value: macros.carbs, unit: 'g' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ label, value, unit }) => (
        <div
          key={label}
          className="backdrop-blur-md bg-white/10 rounded-lg p-4 text-center"
        >
          <p className="text-white/70 text-sm">{label}</p>
          <p className="text-white text-2xl font-bold mt-1">
            {value}
            <span className="text-white/70 text-sm ml-1">{unit}</span>
          </p>
        </div>
      ))}
    </div>
  );
}