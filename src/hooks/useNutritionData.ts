import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TimeRange } from "@/components/dashboard/TimeRangeSelector";
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

const getTimeRangeFilter = (timeRange: TimeRange, customStartDate?: Date, customEndDate?: Date) => {
  const now = new Date();
  
  switch (timeRange) {
    case "daily":
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };
    case "weekly":
      return {
        start: startOfWeek(now),
        end: endOfWeek(now),
      };
    case "monthly":
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
    case "yearly":
      return {
        start: startOfYear(now),
        end: endOfYear(now),
      };
    case "custom":
      if (customStartDate && customEndDate) {
        return {
          start: startOfDay(customStartDate),
          end: endOfDay(customEndDate),
        };
      }
      // Fallback to last 7 days if custom dates are not provided
      return {
        start: startOfDay(subDays(now, 7)),
        end: endOfDay(now),
      };
    default:
      return {
        start: startOfWeek(now),
        end: endOfWeek(now),
      };
  }
};

export const useNutritionData = (
  timeRange: TimeRange,
  customStartDate?: Date,
  customEndDate?: Date
) => {
  const { start, end } = getTimeRangeFilter(timeRange, customStartDate, customEndDate);

  const { data: foodEntries = [] } = useQuery({
    queryKey: ["food-entries", timeRange, start, end],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("food_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: waterEntries = [] } = useQuery({
    queryKey: ["water-entries", timeRange, start, end],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("water_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  return {
    foodEntries,
    waterEntries,
  };
};