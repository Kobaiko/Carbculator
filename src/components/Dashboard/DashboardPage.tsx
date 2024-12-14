import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { PageLayout } from '../../layouts/PageLayout';
import { PageHeader } from '../Layout/PageHeader';
import { TimeframeSelector } from './TimeframeSelector';
import { NutritionSummary } from './NutritionSummary';
import { WeightBMICard } from './WeightBMICard';
import { TrendsChart } from './TrendsChart';
import { Recommendations } from './Recommendations';
import { useProfile } from '../../hooks/useProfile';
import { useMealHistory } from '../../hooks/useMealHistory';
import { useProgressHistory } from '../../hooks/useProgressHistory';
import { useWaterTracking } from '../../hooks/useWaterTracking';
import type { Timeframe } from '../../types/dashboard';

export function DashboardPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>('week');
  const { profile } = useProfile();
  const { history: mealHistory } = useMealHistory();
  const { history: progressHistory } = useProgressHistory();
  const { goal: waterGoal, getEntriesForDate } = useWaterTracking();

  return (
    <PageLayout>
      <PageHeader icon={BarChart3} title="Dashboard">
        <TimeframeSelector
          selected={timeframe}
          onChange={setTimeframe}
        />
      </PageHeader>

      <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
        <WeightBMICard profile={profile} />
        <NutritionSummary
          timeframe={timeframe}
          progressHistory={progressHistory}
        />
      </div>

      <TrendsChart
        timeframe={timeframe}
        progressHistory={progressHistory}
        waterGoal={waterGoal}
        getWaterEntries={getEntriesForDate}
      />

      <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
        <Recommendations
          profile={profile}
          progressHistory={progressHistory}
          mealHistory={mealHistory}
        />
      </div>
    </PageLayout>
  );
}