import React from 'react';
import { format } from 'date-fns';
import { Trash2, GlassWater } from 'lucide-react';
import { Button } from '../UI/Button';
import type { WaterEntry } from '../../types/water';

interface WaterEntriesProps {
  entries: WaterEntry[];
  onDelete: (id: string) => void;
}

export function WaterEntries({ entries, onDelete }: WaterEntriesProps) {
  if (entries.length === 0) {
    return (
      <p className="text-center text-blue-500 dark:text-blue-400 py-4">
        No water intake recorded today
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="bg-white dark:bg-blue-900/30 rounded-lg p-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
              <GlassWater className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-blue-700 dark:text-blue-300 font-medium">
                {entry.amount}ml
              </p>
              <p className="text-xs text-blue-500 dark:text-blue-400">
                {format(new Date(entry.timestamp), 'HH:mm')}
              </p>
            </div>
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDelete(entry.id)}
            className="!p-1.5 hover:!bg-red-100 dark:hover:!bg-red-900/30 hover:!text-red-600 dark:hover:!text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}