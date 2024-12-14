import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import type { Timeframe } from '../../types/dashboard';
import type { MacroGoals } from '../../types/goals';
import type { WaterGoal } from '../../types/water';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TrendsChartProps {
  timeframe: Timeframe;
  progressHistory: {
    [date: string]: {
      consumed: MacroGoals;
      goals: MacroGoals;
    };
  };
  waterGoal: WaterGoal;
  getWaterEntries: (date: string) => { consumed: number };
}

export function TrendsChart({
  timeframe,
  progressHistory,
  waterGoal,
  getWaterEntries
}: TrendsChartProps) {
  const dates = Object.keys(progressHistory).sort();
  const formatDate = (date: string) => format(parseISO(date), 'MMM d');

  const nutritionData = {
    labels: dates.map(formatDate),
    datasets: [
      {
        label: 'Calories',
        data: dates.map(date => progressHistory[date].consumed.calories),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Protein (x10)',
        data: dates.map(date => progressHistory[date].consumed.protein * 10),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Carbs (x10)',
        data: dates.map(date => progressHistory[date].consumed.carbs * 10),
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const hydrationData = {
    labels: dates.map(formatDate),
    datasets: [
      {
        label: 'Water Intake (L)',
        data: dates.map(date => getWaterEntries(date).consumed / 1000),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Daily Goal (L)',
        data: dates.map(() => waterGoal.target / 1000),
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderDash: [5, 5],
        fill: false,
        tension: 0
      }
    ]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'start' as const,
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 12,
          family: "'Inter', sans-serif"
        },
        bodyFont: {
          size: 11,
          family: "'Inter', sans-serif"
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 10,
            family: "'Inter', sans-serif"
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 10,
            family: "'Inter', sans-serif"
          }
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-brand-800/50 rounded-lg p-4 lg:p-6">
        <h3 className="text-lg font-medium text-brand-700 dark:text-brand-300 mb-4">
          Nutrition Trends
        </h3>
        <div className="h-[300px] lg:h-[400px] w-full">
          <Line data={nutritionData} options={commonOptions} />
        </div>
      </div>

      <div className="bg-white dark:bg-brand-800/50 rounded-lg p-4 lg:p-6">
        <h3 className="text-lg font-medium text-brand-700 dark:text-brand-300 mb-4">
          Hydration Trends
        </h3>
        <div className="h-[300px] lg:h-[400px] w-full">
          <Line data={hydrationData} options={commonOptions} />
        </div>
      </div>
    </div>
  );
}