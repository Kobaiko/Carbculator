import React, { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import type { FoodAnalysis } from '../../../types/food';
import { ImageUploader } from '../../Upload/ImageUploader';
import { LoadingSpinner } from '../../UI/LoadingSpinner';
import { CurrentAnalysis } from './CurrentAnalysis';
import { MealsList } from './MealsList';
import { analyzeFoodImage } from '../../../services/food-analysis.service';
import { fileToBase64 } from '../../../utils/image.utils';

interface DailyMealsProps {
  history: Array<{
    id: string;
    date: Date;
    imageUrl: string;
    analysis: FoodAnalysis;
  }>;
  onDelete?: (id: string) => void;
  onAddMeal?: (imageUrl: string, analysis: FoodAnalysis) => void;
}

export function DailyMeals({ history, onDelete, onAddMeal }: DailyMealsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<{
    imageUrl: string;
    analysis: FoodAnalysis;
  } | null>(null);

  const handleImageSelect = async (file: File) => {
    try {
      setIsUploading(true);
      const imageUrl = URL.createObjectURL(file);
      const base64Image = await fileToBase64(file);
      const analysis = await analyzeFoodImage(base64Image);
      
      const foodAnalysis = {
        description: analysis.description,
        macros: {
          calories: analysis.calories,
          protein: analysis.protein,
          fat: analysis.fat,
          carbs: analysis.carbs
        }
      };

      setCurrentAnalysis({ imageUrl, analysis: foodAnalysis });
      
      if (onAddMeal) {
        onAddMeal(imageUrl, foodAnalysis);
      }
    } catch (error) {
      console.error('Error analyzing food:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Filter meals for today
  const today = new Date().setHours(0, 0, 0, 0);
  const todayMeals = history
    .filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate.setHours(0, 0, 0, 0) === today;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-6 p-4 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300">
          <UtensilsCrossed className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Daily Meals</h2>
        </div>
      </div>

      <div className="space-y-4">
        <ImageUploader onImageSelect={handleImageSelect} />
      </div>

      {isUploading && <LoadingSpinner />}

      {currentAnalysis && !isUploading && (
        <CurrentAnalysis
          imageUrl={currentAnalysis.imageUrl}
          analysis={currentAnalysis.analysis}
        />
      )}

      <MealsList meals={todayMeals} onDelete={onDelete} />
    </div>
  );
}