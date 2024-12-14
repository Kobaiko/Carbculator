import React from 'react';
import { Utensils } from 'lucide-react';
import type { Timeframe } from '../../types/dashboard';
import type { MacroGoals } from '../../types/goals';

interface NutritionSummaryProps {
  timeframe: Timeframe;
  progressHistory: {
    [date: string]: {
      consumed: MacroGoals;
      goals: MacroGoals;
    };
  };
}

export function NutritionSummary({ timeframe, progressHistory }: NutritionSummaryProps) {
  const calculateAverages = () => {
    const entries = Object.values(progressHistory);
    if (entries.length === 0) return null;

    const totals = entries.reduce(
      (acc, { consumed }) => ({
        calories: acc.calories + consumed.calories,
        protein: acc.protein + consumed.protein,
        fat: acc.fat + consumed.fat,
        carbs: acc.carbs + consumed.carbs,
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );

    return {
      calories: Math.round(totals.calories / entries.length),
      protein: Math.round(totals.protein / entries.length),
      fat: Math.round(totals.fat / entries.length),
      carbs: Math.round(totals.carbs / entries.length),
    };
  };

  const averages = calculateAverages();
  if (!averages) return null;

  return (
    <div className="bg-white dark:bg-brand-800/50 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Utensils className="h-5 w-5 text-brand-500" />
        <h3 className="text-lg font-medium text-brand-700 dark:text-brand-300">
          Average Daily Nutrition
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-brand-600 dark:text-brand-400">Calories</p>
          <p className="text-2xl font-bold text-brand-700 dark:text-brand-300">
            {averages.calories}
            <span className="text-lg font-normal text-brand-500 ml-1">kcal</span>
          </p>
        </div>

        <div>
          <p className="text-sm text-brand-600 dark:text-brand-400">Protein</p>
          <p className="text-2xl font-bold text-brand-700 dark:text-brand-300">
            {averages.protein}
            <span className="text-lg font-normal text-brand-500 ml-1">g</span>
          </p>
        </div>

        <div>
          <p className="text-sm text-brand-600 dark:text-brand-400">Fat</p>
          <p className="text-2xl font-bold text-brand-700 dark:text-brand-300">
            {averages.fat}
            <span className="text-lg font-normal text-brand-500 ml-1">g</span>
          </p>
        </div>

        <div>
          <p className="text-sm text-brand-600 dark:text-brand-400">Carbs</p>
          <p className="text-2xl font-bold text-brand-700 dark:text-brand-300">
            {averages.carbs}
            <span className="text-lg font-normal text-brand-500 ml-1">g</span>
          </p>
        </div>
      </div>
    </div>
  );
}