import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  // Local state for form data
  const [localGoals, setLocalGoals] = useState({
    dailyCalories: 2000,
    dailyProtein: 150,
    dailyCarbs: 250,
    dailyFats: 70,
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Update local goals when profile is loaded
  useEffect(() => {
    if (profile) {
      setLocalGoals({
        dailyCalories: profile.daily_calories || 2000,
        dailyProtein: profile.daily_protein || 150,
        dailyCarbs: profile.daily_carbs || 250,
        dailyFats: profile.daily_fats || 70,
      });
      console.log("Loaded profile goals:", profile);
    }
  }, [profile]);

  const handleChange = (name: string, value: string) => {
    const numericValue = parseInt(value) || 0;
    setLocalGoals(prev => ({ ...prev, [name]: numericValue }));
    console.log("Updated local goals:", name, numericValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting goals:", localGoals);
    onNext(localGoals);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            value={localGoals.dailyCalories}
            onChange={(e) => handleChange("dailyCalories", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="protein">Daily Protein (g)</Label>
          <Input
            id="protein"
            type="number"
            value={localGoals.dailyProtein}
            onChange={(e) => handleChange("dailyProtein", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="carbs">Daily Carbs (g)</Label>
          <Input
            id="carbs"
            type="number"
            value={localGoals.dailyCarbs}
            onChange={(e) => handleChange("dailyCarbs", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fats">Daily Fats (g)</Label>
          <Input
            id="fats"
            type="number"
            value={localGoals.dailyFats}
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