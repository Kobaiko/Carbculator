import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../UI/Button';
import { CalendarGrid } from './CalendarGrid';
import { DayMealsModal } from './DayMealsModal';
import type { MacroGoals } from '../../types/goals';
import type { FoodAnalysis } from '../../types/food';

interface CalendarProps {
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
  waterGoal: number;
  getWaterEntries: (date: string) => { consumed: number };
}

export function Calendar({ 
  progressHistory, 
  mealHistory,
  waterGoal,
  getWaterEntries
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayMeals = mealHistory.filter(meal => 
      format(new Date(meal.date), 'yyyy-MM-dd') === dateKey
    );
    if (dayMeals.length > 0 || progressHistory[dateKey]) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-brand-700 dark:text-brand-300 font-medium">
            {format(currentDate, 'MMMM yyyy')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={goToPreviousMonth}
            className="!p-1.5 lg:!p-2"
          >
            <ChevronLeft className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={goToNextMonth}
            className="!p-1.5 lg:!p-2"
          >
            <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
        </div>
      </div>

      <CalendarGrid
        days={days}
        currentDate={currentDate}
        progressHistory={progressHistory}
        mealHistory={mealHistory}
        onDayClick={handleDayClick}
      />

      {selectedDate && (
        <DayMealsModal
          date={selectedDate}
          meals={mealHistory.filter(meal => 
            format(new Date(meal.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
          )}
          progress={progressHistory[format(selectedDate, 'yyyy-MM-dd')]}
          waterGoal={waterGoal}
          waterConsumed={getWaterEntries(format(selectedDate, 'yyyy-MM-dd')).consumed}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}