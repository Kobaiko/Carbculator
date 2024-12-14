import React from 'react';

interface MacroStatProps {
  label: string;
  value: number;
  unit: string;
}

export function MacroStat({ label, value, unit }: MacroStatProps) {
  return (
    <div className="bg-brand-50/50 dark:bg-brand-800/30 rounded px-2 py-1">
      <p className="text-brand-600 dark:text-brand-400 text-[10px] leading-tight">
        {label}
      </p>
      <p className="text-brand-700 dark:text-brand-300 text-xs font-medium">
        {value}
        <span className="text-brand-500 dark:text-brand-400 text-[10px] ml-0.5">
          {unit}
        </span>
      </p>
    </div>
  );
}