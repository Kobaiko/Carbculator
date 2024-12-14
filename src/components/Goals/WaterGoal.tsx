import React from 'react';
import { GlassWater, Edit2, Check } from 'lucide-react';
import { Button } from '../UI/Button';
import type { WaterGoal as WaterGoalType } from '../../types/water';

interface WaterGoalProps {
  waterGoal: WaterGoalType;
  isEditing: boolean;
  editedValue: number;
  onEdit: () => void;
  onSave: () => void;
  onChange: (value: number) => void;
}

export function WaterGoal({
  waterGoal,
  isEditing,
  editedValue,
  onEdit,
  onSave,
  onChange,
}: WaterGoalProps) {
  return (
    <div className="bg-white dark:bg-blue-900/30 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <GlassWater className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Water Intake
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <input
                type="number"
                value={editedValue}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-20 px-2 py-1 text-right rounded border border-blue-200 dark:border-blue-700 
                         bg-white dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={onSave}
                className="!p-1.5"
              >
                <Check className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <span className="text-blue-600 dark:text-blue-300 font-semibold">
                {waterGoal.target}ml
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={onEdit}
                className="!p-1.5"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="relative pt-1">
        <div className="h-2 bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300"
            style={{
              width: `${Math.min(100, (waterGoal.consumed / waterGoal.target) * 100)}%`
            }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-blue-600 dark:text-blue-400">
            Consumed: {waterGoal.consumed}ml
          </span>
          <span className="text-blue-600 dark:text-blue-400">
            Remaining: {Math.max(0, waterGoal.target - waterGoal.consumed)}ml
          </span>
        </div>
      </div>
    </div>
  );
}