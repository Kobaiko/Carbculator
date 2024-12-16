import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [goals, setGoals] = useState<null | {
    dailyCalories: number;
    dailyProtein: number;
    dailyCarbs: number;
    dailyFats: number;
  }>(null);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select("daily_calories, daily_protein, daily_carbs, daily_fats")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Set goals only when profile data is loaded
  useEffect(() => {
    if (profile) {
      setGoals({
        dailyCalories: profile.daily_calories,
        dailyProtein: profile.daily_protein,
        dailyCarbs: profile.daily_carbs,
        dailyFats: profile.daily_fats,
      });
      console.log("Profile data loaded:", profile);
    }
  }, [profile]);

  const handleChange = (name: string, value: string) => {
    if (!goals) return;
    
    const numericValue = parseInt(value) || 0;
    setGoals(prev => prev ? { ...prev, [name]: numericValue } : null);
    console.log("Updated goals:", name, numericValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goals) return;
    
    console.log("Submitting goals:", goals);
    onNext(goals);
  };

  if (error) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-destructive">Error Loading Profile</h1>
        <p className="text-muted-foreground">Failed to load your profile data. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (isLoading || !goals) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
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
            value={goals.dailyCalories}
            onChange={(e) => handleChange("dailyCalories", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="protein">Daily Protein (g)</Label>
          <Input
            id="protein"
            type="number"
            value={goals.dailyProtein}
            onChange={(e) => handleChange("dailyProtein", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="carbs">Daily Carbs (g)</Label>
          <Input
            id="carbs"
            type="number"
            value={goals.dailyCarbs}
            onChange={(e) => handleChange("dailyCarbs", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fats">Daily Fats (g)</Label>
          <Input
            id="fats"
            type="number"
            value={goals.dailyFats}
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