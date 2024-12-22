import { Navigation } from "@/components/Navigation";
import { useNutritionProgress } from "@/hooks/useNutritionProgress";
import { GoalsGrid } from "@/components/daily-goals/GoalsGrid";
import { EditActions } from "@/components/daily-goals/EditActions";
import { useGoalsEditor } from "@/hooks/useGoalsEditor";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function DailyGoals() {
  const queryClient = useQueryClient();
  const { progress, goals, isLoading } = useNutritionProgress();
  console.log('DailyGoals page - goals:', goals);
  console.log('DailyGoals page - progress:', progress);

  // Refresh data when component mounts
  useEffect(() => {
    // Invalidate and refetch all relevant queries
    queryClient.invalidateQueries({ queryKey: ["todaysMeals"] });
    queryClient.invalidateQueries({ queryKey: ["todaysWater"] });
    queryClient.invalidateQueries({ queryKey: ["profile"] });

    // Cleanup function
    return () => {
      // Cancel any pending queries when leaving the page
      queryClient.cancelQueries({ queryKey: ["todaysMeals"] });
      queryClient.cancelQueries({ queryKey: ["todaysWater"] });
      queryClient.cancelQueries({ queryKey: ["profile"] });
    };
  }, []); // Empty dependency array means this runs once when component mounts

  const {
    isEditing,
    editedGoals,
    handleEditClick,
    handleSaveGoals,
    handleEditChange,
    setIsEditing,
  } = useGoalsEditor(goals || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    water: 0,
  });

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

  if (!goals) {
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