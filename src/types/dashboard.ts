export type Timeframe = 'week' | 'month' | 'year';

export interface NutritionTrend {
  date: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  water: number;
}

export interface Recommendation {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
}