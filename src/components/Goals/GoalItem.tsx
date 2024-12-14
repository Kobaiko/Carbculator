import React from 'react';
import { Edit2, Check } from 'lucide-react';
import { Button } from '../UI/Button';

interface GoalItemProps {
  label: string;
  value: number;
  unit: string;
  consumed: number;
  remaining: number;
  isEditing: boolean;
  editedValue: number;
  onEdit: () => void;
  onSave: () => void;
  onChange: (value: number) => void;
}

export function GoalItem({
  label,
  value,
  unit,
  consumed,
  remaining,
  isEditing,
  editedValue,
  onEdit,
  onSave,
  onChange,
}: GoalItemProps) {
  return (
    <div className="bg-white dark:bg-brand-800/50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-brand-600 dark:text-brand-400">
            {label}
          </span>
          <span className="text-brand-700 dark:text-brand-300 font-semibold">
            {value} {unit}
          </span>
        </div>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={editedValue}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-20 px-2 py-1 text-right rounded border border-brand-200 dark:border-brand-700 
                       bg-white dark:bg-brand-800 text-brand-700 dark:text-brand-300"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={onSave}
              className="!p-1.5"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={onEdit}
            className="!p-1.5"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="relative pt-1">
        <div className="h-2 bg-brand-100 dark:bg-brand-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 dark:bg-brand-400 transition-all duration-300"
            style={{
              width: `${Math.min(100, (consumed / value) * 100)}%`
            }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-brand-600 dark:text-brand-400">
            Consumed: {consumed} {unit}
          </span>
          <span className="text-brand-600 dark:text-brand-400">
            Remaining: {remaining} {unit}
          </span>
        </div>
      </div>
    </div>
  );
}