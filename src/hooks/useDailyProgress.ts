import { useState, useEffect } from 'react';
import type { MacroGoals, DailyProgress } from '../types/goals';

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function calculateRemaining(goals: MacroGoals, consumed: MacroGoals): MacroGoals {
  return {
    calories: Math.max(0, goals.calories - consumed.calories),
    protein: Math.max(0, goals.protein - consumed.protein),
    fat: Math.max(0, goals.fat - consumed.fat),
    carbs: Math.max(0, goals.carbs - consumed.carbs),
  };
}

export function useDailyProgress(goals: MacroGoals) {
  const [progress, setProgress] = useState<DailyProgress>(() => {
    const todayKey = getTodayKey();
    const saved = localStorage.getItem(`progress_${todayKey}`);
    const defaultProgress = {
      date: todayKey,
      consumed: { calories: 0, protein: 0, fat: 0, carbs: 0 },
      remaining: { ...goals },
    };
    return saved ? JSON.parse(saved) : defaultProgress;
  });

  // Update progress when goals change
  useEffect(() => {
    setProgress(prev => ({
      ...prev,
      remaining: calculateRemaining(goals, prev.consumed)
    }));
  }, [goals]);

  const addMeal = (macros: MacroGoals) => {
    const todayKey = getTodayKey();
    
    setProgress(prev => {
      const newConsumed = {
        calories: prev.consumed.calories + macros.calories,
        protein: prev.consumed.protein + macros.protein,
        fat: prev.consumed.fat + macros.fat,
        carbs: prev.consumed.carbs + macros.carbs,
      };

      const newProgress = {
        date: todayKey,
        consumed: newConsumed,
        remaining: calculateRemaining(goals, newConsumed),
      };

      // Save to localStorage
      localStorage.setItem(`progress_${todayKey}`, JSON.stringify(newProgress));
      
      // Also update the progress history
      const progressHistory = localStorage.getItem('progressHistory');
      const history = progressHistory ? JSON.parse(progressHistory) : {};
      history[todayKey] = {
        consumed: newConsumed,
        goals: goals
      };
      localStorage.setItem('progressHistory', JSON.stringify(history));
      
      return newProgress;
    });
  };

  return { progress, addMeal };
}