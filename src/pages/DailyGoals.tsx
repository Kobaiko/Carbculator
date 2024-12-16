import { Navigation } from "@/components/Navigation";
import { useNutritionProgress } from "@/hooks/useNutritionProgress";
import { DailyGoalsHeader } from "@/components/daily-goals/DailyGoalsHeader";
import { GoalsGrid } from "@/components/daily-goals/GoalsGrid";
import { EditActions } from "@/components/daily-goals/EditActions";
import { useGoalsEditor } from "@/hooks/useGoalsEditor";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function DailyGoals() {
  // Fetch profile data to get default goals
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
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
      console.log("Fetched profile data:", data); // Debug log
      return data;
    },
  });

  const { progress } = useNutritionProgress();
  
  // Only initialize goals editor after profile data is loaded
  const goals = profile ? {
    calories: profile.daily_calories,
    protein: profile.daily_protein,
    carbs: profile.daily_carbs,
    fats: profile.daily_fats,
    water: profile.daily_water,
  } : undefined;

  const {
    isEditing,
    editedGoals,
    handleEditClick,
    handleSaveGoals,
    handleEditChange,
    setIsEditing
  } = useGoalsEditor(goals || { calories: 0, protein: 0, carbs: 0, fats: 0, water: 0 });

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
        <Navigation />
        <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-6 pt-8 md:pt-12 md:ml-20">
          <DailyGoalsHeader />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background pb-16">
      <Navigation />
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-6 pt-8 md:pt-12 md:ml-20">
        <DailyGoalsHeader />
        
        {goals && (
          <GoalsGrid
            progress={progress}
            goals={goals}
            isEditing={isEditing}
            editedGoals={editedGoals}
            onEditChange={handleEditChange}
          />
        )}

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