export interface MacroNutrients {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface FoodAnalysisResponse {
  description: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface FoodAnalysis {
  description: string;
  macros: MacroNutrients;
}