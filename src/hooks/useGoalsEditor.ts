import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Goals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  water: number;
}

interface EditedGoals {
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFats: number;
  dailyWater: number;
}

export function useGoalsEditor(initialGoals: Goals) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoals, setEditedGoals] = useState<EditedGoals>({
    dailyCalories: initialGoals.calories,
    dailyProtein: initialGoals.protein,
    dailyCarbs: initialGoals.carbs,
    dailyFats: initialGoals.fats,
    dailyWater: initialGoals.water,
  });

  // Update edited goals when initial goals change
  useEffect(() => {
    setEditedGoals({
      dailyCalories: initialGoals.calories,
      dailyProtein: initialGoals.protein,
      dailyCarbs: initialGoals.carbs,
      dailyFats: initialGoals.fats,
      dailyWater: initialGoals.water,
    });
  }, [initialGoals]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedGoals({
      dailyCalories: initialGoals.calories,
      dailyProtein: initialGoals.protein,
      dailyCarbs: initialGoals.carbs,
      dailyFats: initialGoals.fats,
      dailyWater: initialGoals.water,
    });
  };

  const handleSaveGoals = async () => {
    try {
      console.log("Saving goals:", editedGoals); // Debug log

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
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      // Invalidate and refetch queries
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      setIsEditing(false);
      
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
    console.log("Editing field:", field, "with value:", value); // Debug log
    setEditedGoals(prev => ({ ...prev, [field]: value }));
  };

  return {
    isEditing,
    editedGoals,
    handleEditClick,
    handleSaveGoals,
    handleEditChange,
    setIsEditing,
  };
}