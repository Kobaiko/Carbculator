import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { WaterGoal, WaterEntry } from '../types/water';

const DEFAULT_WATER_GOAL = 2000; // 2L per day

function getTodayKey() {
  return format(new Date(), 'yyyy-MM-dd');
}

function getStorageKey(date: string) {
  return `water_entries_${date}`;
}

export function useWaterTracking() {
  const [goal, setGoal] = useState<WaterGoal>(() => {
    const saved = localStorage.getItem('waterGoal');
    return saved ? JSON.parse(saved) : { target: DEFAULT_WATER_GOAL, consumed: 0 };
  });

  const [entries, setEntries] = useState<WaterEntry[]>(() => {
    const todayKey = getTodayKey();
    const saved = localStorage.getItem(getStorageKey(todayKey));
    return saved ? JSON.parse(saved) : [];
  });

  // Check for day change and reset if needed
  useEffect(() => {
    const todayKey = getTodayKey();
    const lastActiveDay = localStorage.getItem('lastActiveWaterDay');

    if (lastActiveDay && lastActiveDay !== todayKey) {
      // Save yesterday's entries to history
      if (entries.length > 0) {
        localStorage.setItem(getStorageKey(lastActiveDay), JSON.stringify(entries));
      }
      
      // Reset for new day
      setEntries([]);
      setGoal(prev => ({ ...prev, consumed: 0 }));
    }

    // Update last active day
    localStorage.setItem('lastActiveWaterDay', todayKey);
  }, [entries]);

  // Save current day's entries
  useEffect(() => {
    const todayKey = getTodayKey();
    localStorage.setItem(getStorageKey(todayKey), JSON.stringify(entries));
  }, [entries]);

  // Save water goal
  useEffect(() => {
    localStorage.setItem('waterGoal', JSON.stringify(goal));
  }, [goal]);

  const addWater = (amount: number) => {
    const newEntry: WaterEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      amount
    };

    setEntries(prev => [newEntry, ...prev]);
    setGoal(prev => ({
      ...prev,
      consumed: prev.consumed + amount
    }));
  };

  const deleteEntry = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    setEntries(prev => prev.filter(e => e.id !== id));
    setGoal(prev => ({
      ...prev,
      consumed: Math.max(0, prev.consumed - entry.amount)
    }));
  };

  const updateGoal = (newTarget: number) => {
    setGoal(prev => ({
      ...prev,
      target: newTarget
    }));
  };

  const getEntriesForDate = (date: string) => {
    const saved = localStorage.getItem(getStorageKey(date));
    const entries = saved ? JSON.parse(saved) : [];
    const consumed = entries.reduce((total: number, entry: WaterEntry) => total + entry.amount, 0);
    return { consumed };
  };

  return {
    goal,
    entries,
    addWater,
    deleteEntry,
    updateGoal,
    getEntriesForDate
  };
}