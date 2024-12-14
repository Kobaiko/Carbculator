import React, { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import type { FoodAnalysis } from '../../types/food';
import { ImageUploader } from '../Upload/ImageUploader';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { MacroChart } from '../Analysis/MacroChart';
import { MacroDisplay } from '../Analysis/MacroDisplay';
import { analyzeFoodImage } from '../../services/food-analysis.service';

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

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
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
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const base64Image = reader.result as string;
          const analysis = await analyzeFoodImage(base64Image);
          const imageUrl = URL.createObjectURL(file);
          
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

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error reading file:', error);
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
        <div className="bg-white dark:bg-brand-800/50 rounded-lg p-6 space-y-6">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <img
              src={currentAnalysis.imageUrl}
              alt="Analyzed meal"
              className="object-cover w-full h-full"
            />
          </div>
          
          <p className="text-brand-700 dark:text-brand-300 text-lg text-center">
            {currentAnalysis.analysis.description}
          </p>
          
          <MacroDisplay macros={currentAnalysis.analysis.macros} />
          
          <div className="pt-6 border-t border-brand-100 dark:border-brand-700">
            <h3 className="text-brand-700 dark:text-brand-300 text-center font-medium mb-4">
              Macronutrient Distribution
            </h3>
            <MacroChart macros={currentAnalysis.analysis.macros} />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {todayMeals.length === 0 ? (
          <p className="text-center text-brand-500 dark:text-brand-400 py-8">
            No meals recorded today
          </p>
        ) : (
          <div className="space-y-3">
            {todayMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-white dark:bg-brand-800/50 rounded-lg shadow-sm overflow-hidden transition-colors"
              >
                <div className="flex gap-4 p-3">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={meal.imageUrl}
                      alt={meal.analysis.description}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-xs text-brand-500 dark:text-brand-400">
                        {formatTime(new Date(meal.date))}
                      </p>
                      {onDelete && (
                        <button
                          onClick={() => onDelete(meal.id)}
                          className="text-brand-500 hover:text-red-500 dark:text-brand-400 dark:hover:text-red-400"
                        >
                          <UtensilsCrossed className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-brand-700 dark:text-brand-300 text-sm">
                      {meal.analysis.description}
                    </p>
                    
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <MacroStat
                        label="Calories"
                        value={meal.analysis.macros.calories}
                        unit="kcal"
                      />
                      <MacroStat
                        label="Protein"
                        value={meal.analysis.macros.protein}
                        unit="g"
                      />
                      <MacroStat
                        label="Fat"
                        value={meal.analysis.macros.fat}
                        unit="g"
                      />
                      <MacroStat
                        label="Carbs"
                        value={meal.analysis.macros.carbs}
                        unit="g"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface MacroStatProps {
  label: string;
  value: number;
  unit: string;
}

function MacroStat({ label, value, unit }: MacroStatProps) {
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