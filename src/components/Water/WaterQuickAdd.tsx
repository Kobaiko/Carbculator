import React from 'react';
import { Button } from '../UI/Button';

interface WaterQuickAddProps {
  onAddWater: (amount: number) => void;
  onCustomClick: () => void;
}

const QUICK_ADD_OPTIONS = [
  { label: '250ml', value: 250 },
  { label: '500ml', value: 500 },
  { label: '750ml', value: 750 },
] as const;

export function WaterQuickAdd({ onAddWater, onCustomClick }: WaterQuickAddProps) {
  return (
    <>
      <div className="grid grid-cols-3 gap-3 w-full">
        {QUICK_ADD_OPTIONS.map(({ label, value }) => (
          <Button
            key={value}
            variant="secondary"
            onClick={() => onAddWater(value)}
            className="text-blue-600 dark:text-blue-400"
          >
            + {label}
          </Button>
        ))}
      </div>

      <Button
        variant="secondary"
        fullWidth
        onClick={onCustomClick}
        className="text-blue-600 dark:text-blue-400"
      >
        + Custom Amount
      </Button>
    </>
  );
}