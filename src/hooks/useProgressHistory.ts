import { useState, useEffect } from 'react';
import type { MacroGoals } from '../types/goals';

interface DailyProgress {
  consumed: MacroGoals;
  goals: MacroGoals;
}

export function useProgressHistory() {
  const [history, setHistory] = useState<{ [date: string]: DailyProgress }>({});

  useEffect(() => {
    const savedHistory = localStorage.getItem('progressHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
      } catch (error) {
        console.error('Error parsing progress history:', error);
        localStorage.removeItem('progressHistory');
      }
    }
  }, []);

  const updateProgress = (date: string, progress: DailyProgress) => {
    if (!progress.consumed || !progress.goals) return;

    const normalizedProgress = {
      consumed: {
        calories: Number(progress.consumed.calories) || 0,
        protein: Number(progress.consumed.protein) || 0,
        fat: Number(progress.consumed.fat) || 0,
        carbs: Number(progress.consumed.carbs) || 0
      },
      goals: {
        calories: Number(progress.goals.calories) || 0,
        protein: Number(progress.goals.protein) || 0,
        fat: Number(progress.goals.fat) || 0,
        carbs: Number(progress.goals.carbs) || 0
      }
    };

    setHistory(prev => {
      const newHistory = {
        ...prev,
        [date]: normalizedProgress
      };
      localStorage.setItem('progressHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  return {
    history,
    updateProgress
  };
}