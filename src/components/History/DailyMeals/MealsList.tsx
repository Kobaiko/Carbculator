import React from 'react';
import { Trash2 } from 'lucide-react';
import type { FoodAnalysis } from '../../../types/food';
import { MacroStat } from './MacroStat';

interface MealsListProps {
  meals: Array<{
    id: string;
    date: Date;
    imageUrl: string;
    analysis: FoodAnalysis;
  }>;
  onDelete?: (id: string) => void;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export function MealsList({ meals, onDelete }: MealsListProps) {
  if (meals.length === 0) {
    return (
      <p className="text-center text-brand-500 dark:text-brand-400 py-8">
        No meals recorded today
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {meals.map((meal) => (
        <div
          key={meal.id}
          className="bg-white dark:bg-brand-800/50 rounded-lg shadow-sm overflow-hidden transition-colors"
        >
          <div className="flex gap-4 p-3">
            <div className="w-16 h-16 flex-shrink-0">
              <img
                src={meal.imageUrl}
                alt={meal.analysis.description}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <p className="text-xs text-brand-500 dark:text-brand-400">
                  {formatTime(new Date(meal.date))}
                </p>
                {onDelete && (
                  <button
                    onClick={() => onDelete(meal.id)}
                    className="text-brand-500 hover:text-red-500 dark:text-brand-400 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="mt-1 text-brand-700 dark:text-brand-300 text-sm">
                {meal.analysis.description}
              </p>
              
              <div className="grid grid-cols-4 gap-2 mt-2">
                <MacroStat
                  label="Calories"
                  value={meal.analysis.macros.calories}
                  unit="kcal"
                />
                <MacroStat
                  label="Protein"
                  value={meal.analysis.macros.protein}
                  unit="g"
                />
                <MacroStat
                  label="Fat"
                  value={meal.analysis.macros.fat}
                  unit="g"
                />
                <MacroStat
                  label="Carbs"
                  value={meal.analysis.macros.carbs}
                  unit="g"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}