import { useState, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { TrendsChart } from "@/components/dashboard/TrendsChart";
import { Dumbbell, Flame, Apple, Droplets } from "lucide-react";
import { TimeRange, TimeRangeSelector } from "@/components/dashboard/TimeRangeSelector";
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { AddFoodButton } from "@/components/AddFoodButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const totals = foodEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + Number(entry.protein),
      carbs: acc.carbs + Number(entry.carbs),
      fats: acc.fats + Number(entry.fats),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  // Prepare data for charts
  const chartData = useMemo(() => {
    const caloriesData = foodEntries.map(entry => ({
      date: entry.created_at,
      value: entry.calories,
    }));

    const macroData = foodEntries.map(entry => ({
      date: entry.created_at,
      protein: Number(entry.protein),
      carbs: Number(entry.carbs),
      fats: Number(entry.fats),
    }));

    return { calories: caloriesData, macros: macroData };
  }, [foodEntries]);

  // Format stats card values based on time range
  const getStatsCardValue = (value: number, goal: number) => {
    if (timeRange === "daily") {
      return `${value} / ${goal}`;
    }
    return value.toString();
  };

  const getStatsCardDescription = (value: number, goal: number) => {
    if (timeRange === "daily") {
      return `${Math.round((value / goal) * 100)}% of goal`;
    }
    switch (timeRange) {
      case "weekly":
        return "Weekly total";
      case "monthly":
        return "Monthly total";
      case "yearly":
        return "Yearly total";
      case "custom":
        return "Total for selected period";
      default:
        return "";
    }
  };

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Calories"
            value={getStatsCardValue(totals.calories, profile?.daily_calories || 2000)}
            description={getStatsCardDescription(totals.calories, profile?.daily_calories || 2000)}
            icon={Flame}
            className="bg-gradient-to-br from-orange-500/10 to-amber-500/10"
          />
          <StatsCard
            title="Protein"
            value={getStatsCardValue(totals.protein, profile?.daily_protein || 150)}
            description={getStatsCardDescription(totals.protein, profile?.daily_protein || 150)}
            icon={Dumbbell}
            className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
          />
          <StatsCard
            title="Carbs"
            value={getStatsCardValue(totals.carbs, profile?.daily_carbs || 250)}
            description={getStatsCardDescription(totals.carbs, profile?.daily_carbs || 250)}
            icon={Apple}
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10"
          />
          <StatsCard
            title="Fats"
            value={getStatsCardValue(totals.fats, profile?.daily_fats || 70)}
            description={getStatsCardDescription(totals.fats, profile?.daily_fats || 70)}
            icon={Droplets}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TrendsChart
            title="Calories Trend"
            data={chartData.calories}
            color="hsl(var(--primary))"
            unit="kcal"
            timeRange={timeRange}
          />
          <TrendsChart
            title="Macronutrients Trend"
            data={chartData.macros}
            color="hsl(var(--primary))"
            unit="g"
            timeRange={timeRange}
            showMultipleLines
          />
        </div>

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