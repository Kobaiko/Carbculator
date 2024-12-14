import React from 'react';
import { GlassWater } from 'lucide-react';
import { PageLayout } from '../../layouts/PageLayout';
import { PageHeader } from '../Layout/PageHeader';
import { WaterTracker } from './WaterTracker';
import type { WaterGoal, WaterEntry } from '../../types/water';

interface WaterTrackerPageProps {
  goal: WaterGoal;
  entries: WaterEntry[];
  onAddWater: (amount: number) => void;
  onDeleteEntry: (id: string) => void;
  onUpdateGoal: (target: number) => void;
}

export function WaterTrackerPage({
  goal,
  entries,
  onAddWater,
  onDeleteEntry,
  onUpdateGoal
}: WaterTrackerPageProps) {
  return (
    <PageLayout>
      <PageHeader icon={GlassWater} title="Water Intake" />
      <WaterTracker
        goal={goal}
        entries={entries}
        onAddWater={onAddWater}
        onDeleteEntry={onDeleteEntry}
        onUpdateGoal={onUpdateGoal}
      />
    </PageLayout>
  );
}