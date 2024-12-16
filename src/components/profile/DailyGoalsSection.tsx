import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DailyGoalsSectionProps {
  formData: {
    daily_calories: string;
    daily_protein: string;
    daily_carbs: string;
    daily_fats: string;
    daily_water: string;
  };
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string, value: string) => void;
}

export function DailyGoalsSection({
  formData,
  handleChange,
  handleBlur,
}: DailyGoalsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Daily Goals</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="daily_calories">Daily Calories (kcal)</Label>
          <Input
            id="daily_calories"
            type="number"
            value={formData.daily_calories}
            onChange={(e) => handleChange('daily_calories', e.target.value)}
            onBlur={(e) => handleBlur('daily_calories', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="daily_protein">Daily Protein (g)</Label>
          <Input
            id="daily_protein"
            type="number"
            value={formData.daily_protein}
            onChange={(e) => handleChange('daily_protein', e.target.value)}
            onBlur={(e) => handleBlur('daily_protein', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="daily_carbs">Daily Carbs (g)</Label>
          <Input
            id="daily_carbs"
            type="number"
            value={formData.daily_carbs}
            onChange={(e) => handleChange('daily_carbs', e.target.value)}
            onBlur={(e) => handleBlur('daily_carbs', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="daily_fats">Daily Fats (g)</Label>
          <Input
            id="daily_fats"
            type="number"
            value={formData.daily_fats}
            onChange={(e) => handleChange('daily_fats', e.target.value)}
            onBlur={(e) => handleBlur('daily_fats', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="daily_water">Daily Water (ml)</Label>
          <Input
            id="daily_water"
            type="number"
            value={formData.daily_water}
            onChange={(e) => handleChange('daily_water', e.target.value)}
            onBlur={(e) => handleBlur('daily_water', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}