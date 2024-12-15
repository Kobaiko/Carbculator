import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { TimeRange, TimeRangeSelector } from "@/components/dashboard/TimeRangeSelector";
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { AddFoodButton } from "@/components/AddFoodButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MacroTrends } from "@/components/dashboard/MacroTrends";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

const Index = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();

  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case "daily":
        return { start: startOfDay(now), end: endOfDay(now) };
      case "weekly":
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case "monthly":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "yearly":
        return { start: startOfYear(now), end: endOfYear(now) };
      case "custom":
        return {
          start: customStartDate ? startOfDay(customStartDate) : subDays(now, 7),
          end: customEndDate ? endOfDay(customEndDate) : now,
        };
      default:
        return { start: subDays(now, 7), end: now };
    }
  };

  // Fetch food entries from Supabase
  const { data: foodEntries = [] } = useQuery({
    queryKey: ["food-entries", timeRange, customStartDate, customEndDate],
    queryFn: async () => {
      const { start, end } = getDateRange();
      const { data, error } = await supabase
        .from("food_entries")
        .select("*")
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch water entries
  const { data: waterEntries = [] } = useQuery({
    queryKey: ["water-entries", timeRange, customStartDate, customEndDate],
    queryFn: async () => {
      const { start, end } = getDateRange();
      const { data, error } = await supabase
        .from("water_entries")
        .select("*")
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user profile for goals
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

  // Calculate totals based on time range
  const totals = {
    ...foodEntries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + Number(entry.protein),
        carbs: acc.carbs + Number(entry.carbs),
        fats: acc.fats + Number(entry.fats),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    ),
    water: waterEntries.reduce((acc, entry) => acc + entry.amount, 0),
  };

  // Prepare data for charts
  const chartData = {
    calories: foodEntries.map(entry => ({
      date: entry.created_at,
      value: entry.calories,
    })),
    macros: foodEntries.map(entry => ({
      date: entry.created_at,
      protein: Number(entry.protein),
      carbs: Number(entry.carbs),
      fats: Number(entry.fats),
    })),
    water: waterEntries.map(entry => ({
      date: entry.created_at,
      value: entry.amount,
    })),
  };

  const goals = profile ? {
    calories: profile.daily_calories,
    protein: profile.daily_protein,
    carbs: profile.daily_carbs,
    fats: profile.daily_fats,
    water: 2000, // Default water goal in ml
  } : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary pb-16">
      <Navigation />
      <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-6 pt-6 md:pt-8 md:ml-20">
        <div className="flex justify-end mb-8">
          <TimeRangeSelector
            value={timeRange}
            onValueChange={setTimeRange}
            customDateRange={{
              startDate: customStartDate,
              endDate: customEndDate,
              onRangeSelect: (start, end) => {
                setCustomStartDate(start);
                setCustomEndDate(end);
              },
            }}
          />
        </div>

        <DashboardStats
          timeRange={timeRange}
          totals={totals}
          goals={goals}
        />

        <MacroTrends
          timeRange={timeRange}
          caloriesData={chartData.calories}
          macrosData={chartData.macros}
          waterData={chartData.water}
        />

        <InsightsCard insights={{
          trends: "Based on your recent entries, you're maintaining a consistent caloric intake.",
          recommendations: "Try to increase your protein intake to meet your daily goals.",
          goals: "You're on track to meet your weekly nutrition targets.",
        }} />
      </div>
      <AddFoodButton />
    </div>
  );
}

export default Index;