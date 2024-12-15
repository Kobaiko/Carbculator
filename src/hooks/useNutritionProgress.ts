import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useNutritionProgress() {
  // Fetch user profile data
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch today's meals
  const { data: todaysMeals } = useQuery({
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
      return data;
    },
  });

  // Calculate current progress from today's meals
  const progress = {
    calories: todaysMeals?.reduce((sum, meal) => sum + meal.calories, 0) || 0,
    protein: todaysMeals?.reduce((sum, meal) => sum + Number(meal.protein), 0) || 0,
    carbs: todaysMeals?.reduce((sum, meal) => sum + Number(meal.carbs), 0) || 0,
    fats: todaysMeals?.reduce((sum, meal) => sum + Number(meal.fats), 0) || 0,
    water: 0, // This will be updated from water entries
  };

  // Get daily goals from profile with fallback values
  const goals = {
    calories: profile?.daily_calories || 2000,
    protein: profile?.daily_protein || 150,
    carbs: profile?.daily_carbs || 250,
    fats: profile?.daily_fats || 70,
    water: profile?.daily_water || 2000,
  };

  return { profile, progress, goals };
}