import { Navigation } from "@/components/Navigation";
import { useNutritionProgress } from "@/hooks/useNutritionProgress";
import { DailyGoalsHeader } from "@/components/daily-goals/DailyGoalsHeader";
import { GoalsGrid } from "@/components/daily-goals/GoalsGrid";
import { EditActions } from "@/components/daily-goals/EditActions";
import { useGoalsEditor } from "@/hooks/useGoalsEditor";

export default function DailyGoals() {
  const { progress, goals } = useNutritionProgress();
  const {
    isEditing,
    editedGoals,
    handleEditClick,
    handleSaveGoals,
    handleEditChange,
    setIsEditing
  } = useGoalsEditor(goals);

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