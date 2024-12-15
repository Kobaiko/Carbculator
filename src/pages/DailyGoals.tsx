import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNutritionProgress } from "@/hooks/useNutritionProgress";
import { useQueryClient } from "@tanstack/react-query";
import { DailyGoalsHeader } from "@/components/daily-goals/DailyGoalsHeader";
import { GoalsGrid } from "@/components/daily-goals/GoalsGrid";
import { EditActions } from "@/components/daily-goals/EditActions";

export default function DailyGoals() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { progress, goals } = useNutritionProgress();
  
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

  const handleEditChange = (field: string, value: number) => {
    setEditedGoals(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background pb-16">
      <Navigation />
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-6 pt-8 md:pt-12 md:ml-20">
        <DailyGoalsHeader />
        
        <GoalsGrid
          progress={progress}
          goals={goals}
          isEditing={isEditing}
          editedGoals={editedGoals}
          onEditChange={handleEditChange}
        />

        <EditActions
          isEditing={isEditing}
          onEdit={handleEditClick}
          onCancel={() => setIsEditing(false)}
          onSave={handleSaveGoals}
        />
      </div>
    </div>
  );
}