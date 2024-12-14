import { useState, useEffect } from 'react';
import type { MacroGoals } from '../types/goals';

const DEFAULT_GOALS: MacroGoals = {
  calories: 2000,
  protein: 150,
  fat: 67,
  carbs: 250,
};

export function useGoals() {
  const [goals, setGoals] = useState<MacroGoals>(() => {
    const saved = localStorage.getItem('macroGoals');
    return saved ? JSON.parse(saved) : DEFAULT_GOALS;
  });

  useEffect(() => {
    localStorage.setItem('macroGoals', JSON.stringify(goals));
    
    // Update all progress history entries with new goals
    const progressHistory = localStorage.getItem('progressHistory');
    if (progressHistory) {
      const history = JSON.parse(progressHistory);
      const updatedHistory = Object.entries(history).reduce((acc, [date, progress]: [string, any]) => {
        acc[date] = {
          ...progress,
          goals: goals // Update goals for each day
        };
        return acc;
      }, {} as Record<string, any>);
      
      localStorage.setItem('progressHistory', JSON.stringify(updatedHistory));
    }
  }, [goals]);

  return { goals, setGoals };
}