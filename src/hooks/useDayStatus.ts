import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { useNutritionProgress } from "./useNutritionProgress";

type DayStatus = "goals_met" | "goals_not_met" | "no_meals";

export function useDayStatus() {
  const { goals } = useNutritionProgress();

  const { data: allMeals = [] } = useQuery({
    queryKey: ["all-meals"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("food_entries")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
  });

  const getDayMeals = (date: Date) => {
    const start = startOfDay(date);
    const end = endOfDay(date);

    return allMeals.filter((meal) => {
      const mealDate = new Date(meal.created_at);
      return isWithinInterval(mealDate, { start, end });
    });
  };

  const getDayStatus = (date: Date): DayStatus => {
    const dayMeals = getDayMeals(date);
    
    if (dayMeals.length === 0) {
      return "no_meals";
    }

    const dailyTotals = dayMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + Number(meal.protein),
        carbs: acc.carbs + Number(meal.carbs),
        fats: acc.fats + Number(meal.fats),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    const goalsReached = 
      dailyTotals.calories >= goals.calories * 0.8 &&
      dailyTotals.calories <= goals.calories * 1.2 &&
      dailyTotals.protein >= goals.protein * 0.8 &&
      dailyTotals.carbs >= goals.carbs * 0.8 &&
      dailyTotals.fats >= goals.fats * 0.8;

    return goalsReached ? "goals_met" : "goals_not_met";
  };

  return {
    getDayStatus,
    getDayMeals,
  };
}