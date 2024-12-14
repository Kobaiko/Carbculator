import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { PageLayout } from '../../layouts/PageLayout';
import { PageHeader } from '../Layout/PageHeader';
import { Calendar } from './Calendar';
import type { MacroGoals } from '../../types/goals';
import type { FoodAnalysis } from '../../types/food';

interface CalendarPageProps {
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

export function CalendarPage({
  progressHistory,
  mealHistory,
  waterGoal,
  getWaterEntries
}: CalendarPageProps) {
  return (
    <PageLayout>
      <PageHeader icon={CalendarIcon} title="Calendar" />
      <Calendar
        progressHistory={progressHistory}
        mealHistory={mealHistory}
        waterGoal={waterGoal}
        getWaterEntries={getWaterEntries}
      />
    </PageLayout>
  );
}