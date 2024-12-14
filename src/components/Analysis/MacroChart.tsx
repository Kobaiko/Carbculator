import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import type { MacroNutrients } from '../../types/food';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MacroChartProps {
  macros: MacroNutrients;
}

export function MacroChart({ macros }: MacroChartProps) {
  // Calculate caloric values
  const proteinCalories = macros.protein * 4;
  const fatCalories = macros.fat * 9;
  const carbCalories = macros.carbs * 4;
  const totalCalories = proteinCalories + fatCalories + carbCalories;

  // Only show chart if there are calories
  if (totalCalories === 0) {
    return (
      <div className="text-center text-brand-500 dark:text-brand-400 py-8">
        No data available
      </div>
    );
  }

  const data = {
    labels: ['Protein', 'Fat', 'Carbs'],
    datasets: [
      {
        data: [proteinCalories, fatCalories, carbCalories],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // brand-500
          'rgba(22, 101, 52, 0.8)',  // brand-700
          'rgba(74, 222, 128, 0.8)', // brand-400
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(22, 101, 52, 1)',
          'rgba(74, 222, 128, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        align: 'center' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          color: document.documentElement.classList.contains('dark') 
            ? 'rgb(134, 239, 172)' // dark:text-brand-300
            : 'rgb(22, 101, 52)',  // text-brand-700
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / totalCalories) * 100).toFixed(1);
            return `${label}: ${percentage}% (${value.toFixed(0)} kcal)`;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[240px] mx-auto">
      <div className="w-full aspect-square">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}