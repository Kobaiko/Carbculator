import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { PageLayout } from '../../../layouts/PageLayout';
import { PageHeader } from '../../Layout/PageHeader';
import { DailyMeals } from './DailyMeals';
import type { FoodAnalysis } from '../../../types/food';

interface DailyMealsPageProps {
  history: Array<{
    id: string;
    date: Date;
    imageUrl: string;
    analysis: FoodAnalysis;
  }>;
  onDelete?: (id: string) => void;
  onAddMeal?: (imageUrl: string, analysis: FoodAnalysis) => void;
}

export function DailyMealsPage({ history, onDelete, onAddMeal }: DailyMealsPageProps) {
  return (
    <PageLayout>
      <PageHeader icon={UtensilsCrossed} title="Daily Meals" />
      <DailyMeals
        history={history}
        onDelete={onDelete}
        onAddMeal={onAddMeal}
      />
    </PageLayout>
  );
}