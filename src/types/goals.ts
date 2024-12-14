export interface MacroGoals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface DailyProgress {
  date: string;
  consumed: MacroGoals;
  remaining: MacroGoals;
}