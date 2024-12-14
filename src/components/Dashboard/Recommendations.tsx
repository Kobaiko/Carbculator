import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import type { Profile } from '../../types/profile';
import type { MacroGoals } from '../../types/goals';
import type { FoodAnalysis } from '../../types/food';
import type { Recommendation } from '../../types/dashboard';

interface RecommendationsProps {
  profile: Profile;
  progressHistory: {
    [date: string]: {
      consumed: MacroGoals;
      goals: MacroGoals;
    };
  };
  mealHistory: Array<{
    id: string;
    date: Date;
    imageUrl: string;
    analysis: FoodAnalysis;
  }>;
}

export function Recommendations({
  profile,
  progressHistory,
  mealHistory
}: RecommendationsProps) {
  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // BMI-based recommendations
    const bmi = profile.weight / Math.pow(profile.height / 100, 2);
    if (bmi < 18.5) {
      recommendations.push({
        type: 'warning',
        title: 'Underweight BMI',
        description: 'Consider increasing your caloric intake and adding strength training to your routine.'
      });
    } else if (bmi > 25) {
      recommendations.push({
        type: 'warning',
        title: 'Elevated BMI',
        description: 'Focus on portion control and increasing physical activity.'
      });
    }

    // Nutrition-based recommendations
    const recentProgress = Object.values(progressHistory).slice(-7);
    if (recentProgress.length > 0) {
      const avgProtein = recentProgress.reduce((sum, day) => 
        sum + day.consumed.protein, 0) / recentProgress.length;
      
      if (avgProtein < 50) {
        recommendations.push({
          type: 'info',
          title: 'Low Protein Intake',
          description: 'Try to include more lean meats, fish, or plant-based proteins in your meals.'
        });
      }
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  const getIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-brand-800/50 rounded-lg p-6">
      <h3 className="text-lg font-medium text-brand-700 dark:text-brand-300 mb-4">
        Recommendations
      </h3>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="flex gap-3 p-4 rounded-lg bg-brand-50 dark:bg-brand-800/30"
          >
            {getIcon(rec.type)}
            <div>
              <h4 className="font-medium text-brand-700 dark:text-brand-300">
                {rec.title}
              </h4>
              <p className="text-sm text-brand-600 dark:text-brand-400">
                {rec.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}