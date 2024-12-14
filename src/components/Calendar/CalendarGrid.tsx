import React from 'react';
import { format, isSameMonth, isSameDay } from 'date-fns';
import { DayCell } from './DayCell';
import type { MacroGoals } from '../../types/goals';
import type { FoodAnalysis } from '../../types/food';

interface CalendarGridProps {
  days: Date[];
  currentDate: Date;
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
  onDayClick: (date: Date) => void;
}

export function CalendarGrid({ days, currentDate, progressHistory, mealHistory, onDayClick }: CalendarGridProps) {
  return (
    <div className="bg-white dark:bg-brand-800/50 rounded-lg p-2 lg:p-4">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-xs lg:text-sm font-medium text-brand-600 dark:text-brand-400 py-1 lg:py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <DayCell
            key={index}
            day={day}
            isCurrentMonth={isSameMonth(day, currentDate)}
            isToday={isSameDay(day, new Date())}
            progressHistory={progressHistory}
            mealHistory={mealHistory}
            onClick={() => onDayClick(day)}
          />
        ))}
      </div>
    </div>
  );
}