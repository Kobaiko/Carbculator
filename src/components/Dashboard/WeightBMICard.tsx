import React from 'react';
import { Scale } from 'lucide-react';
import type { Profile } from '../../types/profile';

interface WeightBMICardProps {
  profile: Profile;
}

export function WeightBMICard({ profile }: WeightBMICardProps) {
  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-yellow-500' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-500' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500' };
    return { label: 'Obese', color: 'text-red-500' };
  };

  const bmi = Number(calculateBMI(profile.weight, profile.height));
  const category = getBMICategory(bmi);

  return (
    <div className="bg-white dark:bg-brand-800/50 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="h-5 w-5 text-brand-500" />
        <h3 className="text-lg font-medium text-brand-700 dark:text-brand-300">
          Weight & BMI
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-brand-600 dark:text-brand-400">Current Weight</p>
          <p className="text-2xl font-bold text-brand-700 dark:text-brand-300">
            {profile.weight}
            <span className="text-lg font-normal text-brand-500 ml-1">kg</span>
          </p>
        </div>

        <div>
          <p className="text-sm text-brand-600 dark:text-brand-400">Height</p>
          <p className="text-2xl font-bold text-brand-700 dark:text-brand-300">
            {profile.height}
            <span className="text-lg font-normal text-brand-500 ml-1">cm</span>
          </p>
        </div>

        <div className="col-span-2">
          <p className="text-sm text-brand-600 dark:text-brand-400">BMI</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-brand-700 dark:text-brand-300">
              {bmi}
            </p>
            <p className={`text-sm font-medium ${category.color}`}>
              {category.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}