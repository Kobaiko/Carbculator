import { Dumbbell, Flame, Wheat, Droplets, GlassWater } from "lucide-react";
import { GoalCard } from "./GoalCard";

interface GoalsGridProps {
  progress: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    water: number;
  };
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    water: number;
  };
  isEditing: boolean;
  editedGoals: {
    dailyCalories: number;
    dailyProtein: number;
    dailyCarbs: number;
    dailyFats: number;
    dailyWater: number;
  };
  onEditChange: (field: string, value: number) => void;
}

export function GoalsGrid({ progress, goals, isEditing, editedGoals, onEditChange }: GoalsGridProps) {
  console.log('Goals in GoalsGrid:', goals); // Debug log
  console.log('Progress in GoalsGrid:', progress); // Debug log
  console.log('Edited goals in GoalsGrid:', editedGoals); // Debug log
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <GoalCard
        icon={Flame}
        title="Calories"
        unit=" kcal"
        current={progress.calories}
        target={goals.calories}
        iconColor="text-orange-500"
        iconBgColor="bg-orange-500/10"
        isEditing={isEditing}
        editValue={editedGoals.dailyCalories}
        onEditChange={(value) => onEditChange('dailyCalories', value)}
      />

      <GoalCard
        icon={Dumbbell}
        title="Protein"
        unit="g"
        current={progress.protein}
        target={goals.protein}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
        isEditing={isEditing}
        editValue={editedGoals.dailyProtein}
        onEditChange={(value) => onEditChange('dailyProtein', value)}
      />

      <GoalCard
        icon={Wheat}
        title="Carbs"
        unit="g"
        current={progress.carbs}
        target={goals.carbs}
        iconColor="text-amber-500"
        iconBgColor="bg-amber-500/10"
        isEditing={isEditing}
        editValue={editedGoals.dailyCarbs}
        onEditChange={(value) => onEditChange('dailyCarbs', value)}
      />

      <GoalCard
        icon={Droplets}
        title="Fats"
        unit="g"
        current={progress.fats}
        target={goals.fats}
        iconColor="text-green-500"
        iconBgColor="bg-green-500/10"
        isEditing={isEditing}
        editValue={editedGoals.dailyFats}
        onEditChange={(value) => onEditChange('dailyFats', value)}
      />

      <GoalCard
        icon={GlassWater}
        title="Water"
        unit="ml"
        current={progress.water}
        target={goals.water}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
        isEditing={isEditing}
        editValue={editedGoals.dailyWater}
        onEditChange={(value) => onEditChange('dailyWater', value)}
      />
    </div>
  );
}