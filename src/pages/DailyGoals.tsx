import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Dumbbell, Flame, Wheat, Droplets, GlassWater } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { GoalCard } from "@/components/goals/GoalCard";
import { Goal } from "@/types/goals.types";

export default function DailyGoals() {
  const {
    profile,
    isLoading,
    isEditing,
    editedGoals,
    handleEdit,
    handleSave,
    handleCancel,
    handleChange,
  } = useGoals();

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

  const goals: Goal[] = [
    {
      title: "Calories",
      current: 0,
      target: profile.daily_calories,
      icon: Flame,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-500/10",
      field: "daily_calories",
    },
    {
      title: "Protein",
      current: 0,
      target: profile.daily_protein,
      icon: Dumbbell,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
      field: "daily_protein",
    },
    {
      title: "Carbs",
      current: 0,
      target: profile.daily_carbs,
      icon: Wheat,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-500/10",
      field: "daily_carbs",
    },
    {
      title: "Fats",
      current: 0,
      target: profile.daily_fats,
      icon: Droplets,
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10",
      field: "daily_fats",
    },
    {
      title: "Water",
      current: 0,
      target: profile.daily_water,
      icon: GlassWater,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
      field: "daily_water",
    },
  ];

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
          {goals.map((goal) => (
            <GoalCard
              key={goal.field}
              {...goal}
              isEditing={isEditing}
              editedValue={editedGoals?.[goal.field as keyof typeof editedGoals]}
              onEdit={(value) => handleChange(goal.field as keyof typeof editedGoals, value)}
            />
          ))}
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