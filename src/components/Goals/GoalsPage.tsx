import React from 'react';
import { Target } from 'lucide-react';
import { PageLayout } from '../../layouts/PageLayout';
import { PageHeader } from '../Layout/PageHeader';
import { GoalsTab } from './GoalsTab';
import type { MacroGoals } from '../../types/goals';
import type { WaterGoal } from '../../types/water';

interface GoalsPageProps {
  goals: MacroGoals;
  waterGoal: WaterGoal;
  onUpdateGoals: (goals: MacroGoals) => void;
  onUpdateWaterGoal: (target: number) => void;
  progress: {
    consumed: MacroGoals;
    remaining: MacroGoals;
  };
}

export function GoalsPage({
  goals,
  waterGoal,
  onUpdateGoals,
  onUpdateWaterGoal,
  progress
}: GoalsPageProps) {
  return (
    <PageLayout>
      <PageHeader icon={Target} title="Daily Goals" />
      <GoalsTab
        goals={goals}
        waterGoal={waterGoal}
        onUpdateGoals={onUpdateGoals}
        onUpdateWaterGoal={onUpdateWaterGoal}
        progress={progress}
      />
    </PageLayout>
  );
}