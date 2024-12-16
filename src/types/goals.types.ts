import { LucideIcon } from "lucide-react";

export interface Goal {
  title: string;
  current: number;
  target: number;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  field: string;
}

export interface Goals {
  daily_calories: number;
  daily_protein: number;
  daily_carbs: number;
  daily_fats: number;
  daily_water: number;
}