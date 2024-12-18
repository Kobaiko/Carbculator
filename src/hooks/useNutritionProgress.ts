import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useNutritionProgress() {
  // Fetch user profile data
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
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
      console.log('Profile data fetched:', data); // Debug log
      return data;
    },
  });

  // Fetch today's meals
  const { data: todaysMeals, isLoading: isLoadingMeals } = useQuery({
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
      console.log('Todays meals fetched:', data); // Debug log
      return data || [];
    },
  });

  // Calculate current progress from today's meals
  const progress = {
    calories: todaysMeals?.reduce((sum, meal) => sum + (meal.calories || 0), 0) || 0,
    protein: todaysMeals?.reduce((sum, meal) => sum + (Number(meal.protein) || 0), 0) || 0,
    carbs: todaysMeals?.reduce((sum, meal) => sum + (Number(meal.carbs) || 0), 0) || 0,
    fats: todaysMeals?.reduce((sum, meal) => sum + (Number(meal.fats) || 0), 0) || 0,
    water: 0, // This will be updated from water entries
  };

  console.log('Progress calculated:', progress); // Debug log

  // Get daily goals from profile with default values if undefined
  const goals = profile ? {
    calories: profile.daily_calories || 2000,
    protein: profile.daily_protein || 150,
    carbs: profile.daily_carbs || 250,
    fats: profile.daily_fats || 70,
    water: profile.daily_water || 2000,
  } : {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 70,
    water: 2000,
  };

  console.log('Goals from profile:', goals); // Debug log

  return { 
    profile, 
    progress, 
    goals,
    isLoading: isLoadingProfile || isLoadingMeals 
  };
}