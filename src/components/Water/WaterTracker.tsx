import React, { useState } from 'react';
import { GlassWater, Settings } from 'lucide-react';
import { Button } from '../UI/Button';
import { WaterBottle } from './WaterBottle';
import { WaterEntries } from './WaterEntries';
import { WaterQuickAdd } from './WaterQuickAdd';
import { WaterCustomModal } from './WaterCustomModal';
import { WaterSettingsModal } from './WaterSettingsModal';
import type { WaterGoal, WaterEntry } from '../../types/water';

interface WaterTrackerProps {
  goal: WaterGoal;
  entries: WaterEntry[];
  onAddWater: (amount: number) => void;
  onDeleteEntry: (id: string) => void;
  onUpdateGoal: (target: number) => void;
}

export function WaterTracker({ 
  goal, 
  entries,
  onAddWater, 
  onDeleteEntry,
  onUpdateGoal 
}: WaterTrackerProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  
  const percentage = (goal.consumed / goal.target) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GlassWater className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-blue-600">Water Intake</h2>
          <span className="ml-auto text-blue-600 font-medium">{goal.target}ml</span>
        </div>
      </div>

      <div className="bg-white dark:bg-blue-900/30 rounded-lg p-6">
        <div className="flex flex-col items-center gap-4">
          <WaterBottle percentage={percentage} />
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {goal.consumed}
              <span className="text-lg font-normal text-blue-500">ml</span>
            </p>
            <p className="text-sm text-blue-500">
              of {goal.target}ml daily goal
            </p>
          </div>

          <WaterQuickAdd onAddWater={onAddWater} onCustomClick={() => setIsCustomOpen(true)} />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-blue-600">
          Today's Entries
        </h3>
        <WaterEntries entries={entries} onDelete={onDeleteEntry} />
      </div>

      {isSettingsOpen && (
        <WaterSettingsModal
          currentTarget={goal.target}
          onClose={() => setIsSettingsOpen(false)}
          onSave={onUpdateGoal}
        />
      )}

      {isCustomOpen && (
        <WaterCustomModal
          onClose={() => setIsCustomOpen(false)}
          onAdd={onAddWater}
        />
      )}
    </div>
  );
}