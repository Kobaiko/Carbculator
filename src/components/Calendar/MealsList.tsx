import React from 'react';
import { format } from 'date-fns';
import type { FoodAnalysis } from '../../types/food';

interface MealsListProps {
  meals: Array<{
    id: string;
    date: Date;
    imageUrl: string;
    analysis: FoodAnalysis;
  }>;
}

export function MealsList({ meals }: MealsListProps) {
  return (
    <>
      <h4 className="text-sm font-medium text-brand-600 dark:text-brand-400 mb-4">
        Meals ({meals.length})
      </h4>
      
      {meals.length === 0 ? (
        <p className="text-center text-brand-500 dark:text-brand-400 py-8">
          No meals recorded for this day
        </p>
      ) : (
        <div className="space-y-3">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-white dark:bg-brand-800/30 rounded-lg p-3 flex gap-4"
            >
              <div className="w-20 h-20 flex-shrink-0">
                <img
                  src={meal.imageUrl}
                  alt={meal.analysis.description}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-xs text-brand-500 dark:text-brand-400">
                  {format(new Date(meal.date), 'HH:mm')}
                </p>
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
          ))}
        </div>
      )}
    </>
  );
}

interface MacroStatProps {
  label: string;
  value: number;
  unit: string;
}

function MacroStat({ label, value, unit }: MacroStatProps) {
  return (
    <div className="bg-brand-50/50 dark:bg-brand-800/30 rounded px-2 py-1">
      <p className="text-brand-600 dark:text-brand-400 text-[10px] leading-tight">
        {label}
      </p>
      <p className="text-brand-700 dark:text-brand-300 text-xs font-medium">
        {value}
        <span className="text-brand-500 dark:text-brand-400 text-[10px] ml-0.5">
          {unit}
        </span>
      </p>
    </div>
  );
}