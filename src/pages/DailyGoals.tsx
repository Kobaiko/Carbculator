import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Dumbbell, Flame, Wheat, Droplets, GlassWater } from "lucide-react";

interface Goals {
  daily_calories: number;
  daily_protein: number;
  daily_carbs: number;
  daily_fats: number;
  daily_water: number;
}

export default function DailyGoals() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoals, setEditedGoals] = useState<Goals | null>(null);

  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select("daily_calories, daily_protein, daily_carbs, daily_fats, daily_water")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch today's progress
  const { data: todaysMeals = [] } = useQuery({
    queryKey: ["todaysMeals"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("food_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", today.toISOString())
        .lt("created_at", new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;
      return data || [];
    },
  });

  // Calculate today's progress
  const progress = todaysMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (Number(meal.protein) || 0),
      carbs: acc.carbs + (Number(meal.carbs) || 0),
      fats: acc.fats + (Number(meal.fats) || 0),
      water: 0, // This will be updated from water entries
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0, water: 0 }
  );

  // Update goals mutation
  const updateGoals = useMutation({
    mutationFn: async (newGoals: Goals) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update({
          daily_calories: newGoals.daily_calories,
          daily_protein: newGoals.daily_protein,
          daily_carbs: newGoals.daily_carbs,
          daily_fats: newGoals.daily_fats,
          daily_water: newGoals.daily_water,
        })
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Your goals have been updated.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update goals. Please try again.",
      });
      console.error("Error updating goals:", error);
    },
  });

  const handleEdit = () => {
    if (profile) {
      setEditedGoals(profile);
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (editedGoals) {
      updateGoals.mutate(editedGoals);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedGoals(null);
  };

  const handleChange = (field: keyof Goals, value: string) => {
    if (editedGoals) {
      setEditedGoals({
        ...editedGoals,
        [field]: parseInt(value) || 0,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12 md:ml-20">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const renderGoalCard = (
    icon: any,
    title: string,
    current: number,
    target: number,
    field: keyof Goals,
    iconColor: string,
    bgColor: string
  ) => {
    const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;

    return (
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${bgColor} rounded-full`}>
              {icon({ className: `h-6 w-6 ${iconColor}` })}
            </div>
            <div>
              <h3 className="font-semibold">{title}</h3>
              {!isEditing && (
                <p className="text-sm text-muted-foreground">
                  Daily Target: {target}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Current</div>
            <span className="text-2xl font-bold">{current}</span>
          </div>
        </div>

        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {isEditing && (
          <Input
            type="number"
            min="0"
            value={editedGoals?.[field] || 0}
            onChange={(e) => handleChange(field, e.target.value)}
            className="mt-2"
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background pb-16">
      <Navigation />
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-6 pt-8 md:pt-12 md:ml-20">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Daily Goals</h1>
          <p className="text-muted-foreground">
            Set and track your daily nutrition targets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderGoalCard(
            Flame,
            "Calories",
            progress.calories,
            profile.daily_calories,
            "daily_calories",
            "text-orange-500",
            "bg-orange-500/10"
          )}
          {renderGoalCard(
            Dumbbell,
            "Protein",
            progress.protein,
            profile.daily_protein,
            "daily_protein",
            "text-blue-500",
            "bg-blue-500/10"
          )}
          {renderGoalCard(
            Wheat,
            "Carbs",
            progress.carbs,
            profile.daily_carbs,
            "daily_carbs",
            "text-amber-500",
            "bg-amber-500/10"
          )}
          {renderGoalCard(
            Droplets,
            "Fats",
            progress.fats,
            profile.daily_fats,
            "daily_fats",
            "text-green-500",
            "bg-green-500/10"
          )}
          {renderGoalCard(
            GlassWater,
            "Water",
            progress.water,
            profile.daily_water,
            "daily_water",
            "text-blue-500",
            "bg-blue-500/10"
          )}
        </div>

        <div className="flex justify-center mt-8">
          {!isEditing ? (
            <Button onClick={handleEdit}>Edit Goals</Button>
          ) : (
            <div className="space-x-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Goals</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}