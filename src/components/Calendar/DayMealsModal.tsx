import React from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../UI/Button';
import { MacroSummary } from './MacroSummary';
import { MacroChart } from '../Analysis/MacroChart';
import { WaterSummary } from './WaterSummary';
import { MealsList } from './MealsList';
import type { MacroGoals } from '../../types/goals';
import type { FoodAnalysis } from '../../types/food';

interface DayMealsModalProps {
  date: Date;
  meals: Array<{
    id: string;
    date: Date;
    imageUrl: string;
    analysis: FoodAnalysis;
  }>;
  progress?: {
    consumed: MacroGoals;
    goals: MacroGoals;
  };
  waterGoal: number;
  waterConsumed: number;
  onClose: () => void;
}

export function DayMealsModal({ 
  date, 
  meals, 
  progress,
  waterGoal,
  waterConsumed,
  onClose 
}: DayMealsModalProps) {
  if (!progress) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-brand-800/95 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-brand-100 dark:border-brand-700 flex justify-between items-center sticky top-0 bg-white dark:bg-brand-800/95 z-10">
          <h3 className="text-lg font-semibold text-brand-700 dark:text-brand-300">
            {format(date, 'dd/MM/yyyy')}
          </h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="!p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
          <MacroSummary 
            consumed={progress.consumed}
            goals={progress.goals}
          />
          
          <div className="pt-4 border-t border-brand-100 dark:border-brand-700">
            <h4 className="text-sm font-medium text-brand-600 dark:text-brand-400 mb-4 text-center">
              Macronutrient Distribution
            </h4>
            <MacroChart macros={progress.consumed} />
          </div>

          <div className="pt-4 border-t border-brand-100 dark:border-brand-700">
            <WaterSummary
              consumed={waterConsumed}
              goal={waterGoal}
            />
          </div>

          <div className="pt-4 border-t border-brand-100 dark:border-brand-700">
            <MealsList meals={meals} />
          </div>
        </div>
      </div>
    </div>
  );
}