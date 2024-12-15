import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TimeRange } from "@/components/dashboard/TimeRangeSelector";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

const getTimeRangeFilter = (
  timeRange: TimeRange,
  currentDate: Date,
  customStartDate?: Date,
  customEndDate?: Date
) => {
  switch (timeRange) {
    case "hour":
      return {
        start: startOfDay(currentDate),
        end: endOfDay(currentDate),
      };
    case "day":
      return {
        start: startOfWeek(currentDate),
        end: endOfWeek(currentDate),
      };
    case "week":
      return {
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
      };
    case "month":
      return {
        start: startOfYear(currentDate),
        end: endOfYear(currentDate),
      };
    case "year":
      return {
        start: startOfYear(currentDate),
        end: endOfYear(currentDate),
      };
    case "custom":
      if (customStartDate && customEndDate) {
        return {
          start: startOfDay(customStartDate),
          end: endOfDay(customEndDate),
        };
      }
      return {
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
      };
    default:
      return {
        start: startOfWeek(currentDate),
        end: endOfWeek(currentDate),
      };
  }
};

export const useNutritionData = (
  timeRange: TimeRange,
  currentDate: Date,
  customStartDate?: Date,
  customEndDate?: Date
) => {
  const { start, end } = getTimeRangeFilter(timeRange, currentDate, customStartDate, customEndDate);

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