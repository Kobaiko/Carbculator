import { useState, useEffect } from 'react';
import type { FoodAnalysis } from '../types/food';

interface MealRecord {
  id: string;
  date: Date;
  imageUrl: string;
  analysis: FoodAnalysis;
}

export function useMealHistory() {
  const [history, setHistory] = useState<MealRecord[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('mealHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Ensure dates are properly parsed as Date objects
        const historyWithDates = parsed.map((item: any) => ({
          ...item,
          date: new Date(item.date)
        }));
        setHistory(historyWithDates);
      } catch (error) {
        console.error('Error parsing meal history:', error);
        localStorage.removeItem('mealHistory');
      }
    }
  }, []);

  const addMeal = (imageUrl: string, analysis: FoodAnalysis) => {
    // Always convert image to base64 before storing
    if (imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) {
      fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            const newMeal: MealRecord = {
              id: Date.now().toString(),
              date: new Date(),
              imageUrl: base64String,
              analysis
            };

            const updatedHistory = [newMeal, ...history];
            setHistory(updatedHistory);
            
            // Store dates as ISO strings for better serialization
            const historyForStorage = updatedHistory.map(meal => ({
              ...meal,
              date: meal.date.toISOString()
            }));
            localStorage.setItem('mealHistory', JSON.stringify(historyForStorage));
          };
          reader.readAsDataURL(blob);
        })
        .catch(error => {
          console.error('Error converting image:', error);
          // If conversion fails, store without image
          const newMeal: MealRecord = {
            id: Date.now().toString(),
            date: new Date(),
            imageUrl: '',
            analysis
          };
          const updatedHistory = [newMeal, ...history];
          setHistory(updatedHistory);
          
          const historyForStorage = updatedHistory.map(meal => ({
            ...meal,
            date: meal.date.toISOString()
          }));
          localStorage.setItem('mealHistory', JSON.stringify(historyForStorage));
        });
    } else {
      // If it's already a base64 string, store directly
      const newMeal: MealRecord = {
        id: Date.now().toString(),
        date: new Date(),
        imageUrl,
        analysis
      };

      const updatedHistory = [newMeal, ...history];
      setHistory(updatedHistory);
      
      const historyForStorage = updatedHistory.map(meal => ({
        ...meal,
        date: meal.date.toISOString()
      }));
      localStorage.setItem('mealHistory', JSON.stringify(historyForStorage));
    }
  };

  const deleteMeal = (id: string) => {
    const updatedHistory = history.filter(meal => meal.id !== id);
    setHistory(updatedHistory);
    
    const historyForStorage = updatedHistory.map(meal => ({
      ...meal,
      date: meal.date.toISOString()
    }));
    localStorage.setItem('mealHistory', JSON.stringify(historyForStorage));
  };

  return {
    history,
    addMeal,
    deleteMeal
  };
}