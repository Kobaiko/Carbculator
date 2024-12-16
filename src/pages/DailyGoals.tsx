import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Dumbbell, Flame, Wheat, Droplets, GlassWater } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { GoalCard } from "@/components/goals/GoalCard";
import { Goal } from "@/types/goals.types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay } from "date-fns";

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

  // Fetch today's meals
  const { data: todaysMeals = [] } = useQuery({
    queryKey: ["todaysMeals"],
    queryFn: async () => {
      const today = startOfDay(new Date());
      const tomorrow = endOfDay(new Date());

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("food_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", today.toISOString())
        .lte("created_at", tomorrow.toISOString());

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch today's water entries
  const { data: waterEntries = [] } = useQuery({
    queryKey: ["waterEntries"],
    queryFn: async () => {
      const today = startOfDay(new Date());
      const tomorrow = endOfDay(new Date());

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("water_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", today.toISOString())
        .lte("created_at", tomorrow.toISOString());

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading || !profile) {
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

  // Calculate today's totals
  const dailyTotals = todaysMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + Number(meal.protein),
      carbs: acc.carbs + Number(meal.carbs),
      fats: acc.fats + Number(meal.fats),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const waterTotal = waterEntries.reduce((sum, entry) => sum + entry.amount, 0);

  const goals: Goal[] = [
    {
      title: "Calories",
      current: dailyTotals.calories,
      target: profile.daily_calories,
      icon: Flame,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-500/10",
      field: "daily_calories",
    },
    {
      title: "Protein",
      current: dailyTotals.protein,
      target: profile.daily_protein,
      icon: Dumbbell,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
      field: "daily_protein",
    },
    {
      title: "Carbs",
      current: dailyTotals.carbs,
      target: profile.daily_carbs,
      icon: Wheat,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-500/10",
      field: "daily_carbs",
    },
    {
      title: "Fats",
      current: dailyTotals.fats,
      target: profile.daily_fats,
      icon: Droplets,
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10",
      field: "daily_fats",
    },
    {
      title: "Water",
      current: waterTotal,
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