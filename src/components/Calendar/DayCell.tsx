import React from 'react';
import { format, isSameDay } from 'date-fns';
import { clsx } from 'clsx';
import type { MacroGoals } from '../../types/goals';
import type { FoodAnalysis } from '../../types/food';

interface DayCellProps {
  day: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  progressHistory: {
    [date: string]: {
      consumed: MacroGoals;
      goals: MacroGoals;
    };
  };
  mealHistory: Array<{
    id: string;
    date: Date;
    imageUrl: string;
    analysis: FoodAnalysis;
  }>;
  onClick: () => void;
}

export function DayCell({ 
  day, 
  isCurrentMonth, 
  isToday,
  progressHistory,
  mealHistory,
  onClick 
}: DayCellProps) {
  const dateKey = format(day, 'yyyy-MM-dd');
  const dayMeals = mealHistory.filter(meal => 
    format(new Date(meal.date), 'yyyy-MM-dd') === dateKey
  );
  const hasData = dayMeals.length > 0;
  const dayProgress = progressHistory[dateKey];
  
  const checkGoalsAchievement = () => {
    if (!dayProgress?.consumed || !dayProgress?.goals) return null;

    const { consumed, goals } = dayProgress;
    
    const totalConsumed = {
      calories: consumed.calories,
      protein: consumed.protein,
      fat: consumed.fat,
      carbs: consumed.carbs
    };

    const caloriesAchieved = (totalConsumed.calories / goals.calories) * 100;
    const proteinAchieved = (totalConsumed.protein / goals.protein) * 100;
    const fatAchieved = (totalConsumed.fat / goals.fat) * 100;
    const carbsAchieved = (totalConsumed.carbs / goals.carbs) * 100;

    return (
      caloriesAchieved >= 90 &&
      proteinAchieved >= 90 &&
      fatAchieved >= 90 &&
      carbsAchieved >= 90
    );
  };

  const goalsAchieved = hasData ? checkGoalsAchievement() : null;

  return (
    <div className={clsx(
      'aspect-square p-1 relative',
      !isCurrentMonth && 'opacity-30'
    )}>
      <button
        onClick={onClick}
        disabled={!hasData && !progressHistory[dateKey]}
        className={clsx(
          'w-full h-full rounded-lg flex items-center justify-center',
          'text-xs lg:text-sm relative transition-colors',
          hasData && 'cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-700/50',
          !hasData && 'cursor-default',
          isToday && 'ring-2 ring-brand-500 dark:ring-brand-400',
          goalsAchieved && 'bg-brand-100 dark:bg-brand-700/50',
          goalsAchieved === false && 'bg-red-100 dark:bg-red-900/30'
        )}
      >
        <span className={clsx(
          isToday ? 'text-brand-700 dark:text-brand-300 font-semibold' : 'text-brand-600 dark:text-brand-400'
        )}>
          {format(day, 'd')}
        </span>
        {hasData && (
          <span className={clsx(
            'absolute bottom-0.5 right-0.5 w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full',
            goalsAchieved ? 'bg-brand-500' : 'bg-red-500'
          )} />
        )}
      </button>
    </div>
  );
}