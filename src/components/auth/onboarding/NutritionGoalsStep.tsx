import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface NutritionGoalsStepProps {
  onBack: () => void;
  onNext: (data: {
    dailyCalories: number;
    dailyProtein: number;
    dailyCarbs: number;
    dailyFats: number;
  }) => void;
}

export function NutritionGoalsStep({ onBack, onNext }: NutritionGoalsStepProps) {
  const [formData, setFormData] = useState({
    dailyCalories: 2000,
    dailyProtein: 150,
    dailyCarbs: 250,
    dailyFats: 70,
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Set Your Daily Goals 🎯</h1>
        <p className="text-muted-foreground">
          Let's establish your nutritional targets
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="calories">Daily Calories (kcal)</Label>
          <Input
            id="calories"
            type="number"
            value={formData.dailyCalories}
            onChange={(e) => handleChange("dailyCalories", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="protein">Daily Protein (g)</Label>
          <Input
            id="protein"
            type="number"
            value={formData.dailyProtein}
            onChange={(e) => handleChange("dailyProtein", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="carbs">Daily Carbs (g)</Label>
          <Input
            id="carbs"
            type="number"
            value={formData.dailyCarbs}
            onChange={(e) => handleChange("dailyCarbs", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fats">Daily Fats (g)</Label>
          <Input
            id="fats"
            type="number"
            value={formData.dailyFats}
            onChange={(e) => handleChange("dailyFats", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Next
        </Button>
      </div>
    </form>
  );
}