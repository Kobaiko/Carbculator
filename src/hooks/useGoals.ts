import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Goals } from "@/types/goals.types";

export function useGoals() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoals, setEditedGoals] = useState<Goals | null>(null);

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
      setEditedGoals({
        daily_calories: profile.daily_calories,
        daily_protein: profile.daily_protein,
        daily_carbs: profile.daily_carbs,
        daily_fats: profile.daily_fats,
        daily_water: profile.daily_water,
      });
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

  return {
    profile,
    isLoading,
    isEditing,
    editedGoals,
    handleEdit,
    handleSave,
    handleCancel,
    handleChange,
  };
}