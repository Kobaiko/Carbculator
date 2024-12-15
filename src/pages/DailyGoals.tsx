import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Dumbbell, Flame, Wheat, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GoalCard } from "@/components/daily-goals/GoalCard";
import { WaterCard } from "@/components/daily-goals/WaterCard";
import { useNutritionProgress } from "@/hooks/useNutritionProgress";
import { useQueryClient } from "@tanstack/react-query";

export default function DailyGoals() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { progress, goals, profile } = useNutritionProgress();
  
  const [editedGoals, setEditedGoals] = useState({
    dailyCalories: goals?.calories || 2000,
    dailyProtein: goals?.protein || 150,
    dailyCarbs: goals?.carbs || 250,
    dailyFats: goals?.fats || 70,
    dailyWater: goals?.water || 2000,
  });

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedGoals({
      dailyCalories: goals.calories,
      dailyProtein: goals.protein,
      dailyCarbs: goals.carbs,
      dailyFats: goals.fats,
      dailyWater: goals.water,
    });
  };

  const handleSaveGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update({
          daily_calories: editedGoals.dailyCalories,
          daily_protein: editedGoals.dailyProtein,
          daily_carbs: editedGoals.dailyCarbs,
          daily_fats: editedGoals.dailyFats,
          daily_water: editedGoals.dailyWater,
        })
        .eq("id", user.id);

      if (error) throw error;

      setIsEditing(false);
      // Invalidate all relevant queries to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["waterEntries"] });
      queryClient.invalidateQueries({ queryKey: ["water-entries"] });
      
      toast({
        title: "Success",
        description: "Your daily goals have been updated.",
      });
    } catch (error) {
      console.error("Error saving goals:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update your goals. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background pb-16">
      <Navigation />
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-6 pt-8 md:pt-12 md:ml-20">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Daily Goals</h1>
          <p className="text-muted-foreground">Track your daily nutrition progress</p>
        </div>

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
            onEditChange={(value) => setEditedGoals(prev => ({ ...prev, dailyCalories: value }))}
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
            onEditChange={(value) => setEditedGoals(prev => ({ ...prev, dailyProtein: value }))}
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
            onEditChange={(value) => setEditedGoals(prev => ({ ...prev, dailyCarbs: value }))}
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
            onEditChange={(value) => setEditedGoals(prev => ({ ...prev, dailyFats: value }))}
          />

          <WaterCard current={progress.water} target={editedGoals.dailyWater} />
        </div>

        <div className="flex justify-center mt-8">
          {!isEditing ? (
            <Button onClick={handleEditClick}>Edit Goals</Button>
          ) : (
            <div className="space-x-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSaveGoals}>Save Goals</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
