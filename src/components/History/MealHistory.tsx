import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import type { FoodAnalysis } from '../../types/food';
import { Button } from '../UI/Button';

interface MealHistoryProps {
  history: Array<{
    id: string;
    date: Date;
    imageUrl: string;
    analysis: FoodAnalysis;
  }>;
  onDelete?: (id: string) => void;
}

function formatDate(date: Date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} at ${hours}:${minutes}`;
}

export function MealHistory({ history, onDelete }: MealHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300">
        <Clock className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Recent Meals</h2>
      </div>
      
      <div className="space-y-3">
        {history.map((meal) => (
          <div key={meal.id} className="bg-white dark:bg-brand-800/50 rounded-lg shadow-sm overflow-hidden transition-colors">
            <div className="flex gap-4 p-3">
              <div className="w-20 h-20 flex-shrink-0">
                <img
                  src={meal.imageUrl}
                  alt={meal.analysis.description}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-xs text-brand-500 dark:text-brand-400">
                    {formatDate(meal.date)}
                  </p>
                  {onDelete && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onDelete(meal.id)}
                      className="!p-1 hover:text-red-600 dark:hover:text-red-400 flex-shrink-0"
                      aria-label="Delete meal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="mt-1 text-brand-700 dark:text-brand-300 text-sm font-medium">
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
    </div>
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
      <p className="text-brand-600 dark:text-brand-400 text-[10px] leading-tight">{label}</p>
      <p className="text-brand-700 dark:text-brand-300 text-xs font-medium">
        {value}
        <span className="text-brand-500 dark:text-brand-400 text-[10px] ml-0.5">
          {unit}
        </span>
      </p>
    </div>
  );
}