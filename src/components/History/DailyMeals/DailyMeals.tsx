import React, { useState } from 'react';
import type { FoodAnalysis } from '../../../types/food';
import { ImageUploader } from '../../Upload/ImageUploader';
import { LoadingSpinner } from '../../UI/LoadingSpinner';
import { CurrentAnalysis } from './CurrentAnalysis';
import { MealsList } from './MealsList';
import { analyzeFoodImage } from '../../../services/food-analysis.service';
import { fileToBase64 } from '../../../utils/file.utils';

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
      console.log('Processing image:', file.name, file.type, file.size);

      const base64Image = await fileToBase64(file);
      console.log('Image converted to base64');

      const analysis = await analyzeFoodImage(base64Image);
      console.log('Image analysis complete:', analysis);

      const foodAnalysis = {
        description: analysis.description,
        macros: {
          calories: analysis.calories,
          protein: analysis.protein,
          fat: analysis.fat,
          carbs: analysis.carbs
        }
      };

      // Create temporary URL for preview
      const imageUrl = URL.createObjectURL(file);
      setCurrentAnalysis({ imageUrl, analysis: foodAnalysis });
      
      if (onAddMeal) {
        onAddMeal(base64Image, foodAnalysis);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process the image. Please try again.');
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
    <div className="space-y-6">
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