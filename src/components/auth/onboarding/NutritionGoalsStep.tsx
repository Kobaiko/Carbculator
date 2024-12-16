import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [formData, setFormData] = useState<{
    dailyCalories: string;
    dailyProtein: string;
    dailyCarbs: string;
    dailyFats: string;
  }>({
    dailyCalories: "",
    dailyProtein: "",
    dailyCarbs: "",
    dailyFats: "",
  });

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

  // Set initial form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        dailyCalories: profile.daily_calories.toString(),
        dailyProtein: profile.daily_protein.toString(),
        dailyCarbs: profile.daily_carbs.toString(),
        dailyFats: profile.daily_fats.toString(),
      });
      console.log("Loaded profile data:", profile);
    }
  }, [profile]);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log(`Updated ${name}:`, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert form data to numbers and validate
      const goals = {
        dailyCalories: parseInt(formData.dailyCalories),
        dailyProtein: parseInt(formData.dailyProtein),
        dailyCarbs: parseInt(formData.dailyCarbs),
        dailyFats: parseInt(formData.dailyFats),
      };

      // Validate numbers
      for (const [key, value] of Object.entries(goals)) {
        if (isNaN(value) || value <= 0) {
          toast({
            variant: "destructive",
            title: "Invalid Input",
            description: `Please enter a valid number for ${key.replace('daily', '')}`,
          });
          return;
        }
      }

      console.log("Submitting goals:", goals);
      onNext(goals);
    } catch (error) {
      console.error("Error submitting goals:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save goals. Please try again.",
      });
    }
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

  if (isLoading) {
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
            value={formData.dailyCalories}
            onChange={(e) => handleChange("dailyCalories", e.target.value)}
            required
            min="1"
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
            min="1"
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
            min="1"
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
            min="1"
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