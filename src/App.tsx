import React, { useState } from 'react';
import { SideMenu } from './components/Layout/SideMenu';
import { DashboardPage } from './components/Dashboard/DashboardPage';
import { DailyMealsPage } from './components/History/DailyMeals/DailyMealsPage';
import { GoalsPage } from './components/Goals/GoalsPage';
import { CalendarPage } from './components/Calendar/CalendarPage';
import { WaterTrackerPage } from './components/Water/WaterTrackerPage';
import { ProfilePage } from './components/Profile/ProfilePage';
import { useGoals } from './hooks/useGoals';
import { useMealHistory } from './hooks/useMealHistory';
import { useDailyProgress } from './hooks/useDailyProgress';
import { useProgressHistory } from './hooks/useProgressHistory';
import { useWaterTracking } from './hooks/useWaterTracking';
import type { FoodAnalysis } from './types/food';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'meals' | 'goals' | 'calendar' | 'water' | 'profile'>('dashboard');
  const { goals, setGoals } = useGoals();
  const { history: mealHistory, addMeal, deleteMeal } = useMealHistory();
  const { progress, addMeal: updateProgress } = useDailyProgress(goals);
  const { history: progressHistory, updateProgress: updateProgressHistory } = useProgressHistory();
  const { 
    goal: waterGoal, 
    entries: waterEntries,
    addWater, 
    deleteEntry: deleteWaterEntry,
    updateGoal: updateWaterGoal,
    getEntriesForDate
  } = useWaterTracking();

  const handleAddMeal = (imageUrl: string, analysis: FoodAnalysis) => {
    addMeal(imageUrl, analysis);
    updateProgress(analysis.macros);
  };

  return (
    <div className="min-h-screen bg-brand-50 dark:bg-brand-900 transition-colors">
      <SideMenu 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <main className="lg:ml-20 min-h-screen transition-all duration-300">
        {activeTab === 'dashboard' && (
          <DashboardPage />
        )}
        
        {activeTab === 'meals' && (
          <DailyMealsPage
            history={mealHistory}
            onDelete={deleteMeal}
            onAddMeal={handleAddMeal}
          />
        )}
        
        {activeTab === 'goals' && (
          <GoalsPage
            goals={goals}
            waterGoal={waterGoal}
            onUpdateGoals={setGoals}
            onUpdateWaterGoal={updateWaterGoal}
            progress={progress}
          />
        )}
        
        {activeTab === 'calendar' && (
          <CalendarPage
            progressHistory={progressHistory}
            mealHistory={mealHistory}
            waterGoal={waterGoal.target}
            getWaterEntries={getEntriesForDate}
          />
        )}

        {activeTab === 'water' && (
          <WaterTrackerPage
            goal={waterGoal}
            entries={waterEntries}
            onAddWater={addWater}
            onDeleteEntry={deleteWaterEntry}
            onUpdateGoal={updateWaterGoal}
          />
        )}

        {activeTab === 'profile' && (
          <ProfilePage />
        )}
      </main>
    </div>
  );
}