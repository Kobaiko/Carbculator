import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { TimeRange, TimeRangeSelector } from "@/components/dashboard/TimeRangeSelector";
import { AddFoodButton } from "@/components/AddFoodButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MacroTrends } from "@/components/dashboard/MacroTrends";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { toast } from "sonner";
import { useNutritionData } from "@/hooks/useNutritionData";

// Move data fetching logic to separate hooks for better organization
const useProfileData = () => {
  return useQuery({
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
};

// Separate hook for daily insights that refreshes only once per day
const useDailyInsights = () => {
  return useQuery({
    queryKey: ["daily-insights", new Date().toDateString()], // Changes only once per day
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-insights', {
          body: { type: "general" },
        });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching insights:', error);
        toast.error('Failed to generate insights');
        return {
          trends: "Unable to analyze trends at the moment.",
          recommendations: "Recommendations are currently unavailable.",
          goals: "Goal analysis is temporarily unavailable.",
        };
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // Consider data fresh for 24 hours
    gcTime: 24 * 60 * 60 * 1000, // Keep in cache for 24 hours (replaced cacheTime)
  });
};

const Index = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();

  const { foodEntries, waterEntries } = useNutritionData(timeRange, currentDate, customStartDate, customEndDate);
  const { data: profile } = useProfileData();
  const { data: insights, isLoading: isLoadingInsights } = useDailyInsights();

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
            currentDate={currentDate}
            onDateChange={setCurrentDate}
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

        <InsightsCard 
          insights={insights || {
            trends: "Loading insights...",
            recommendations: "Analyzing your data...",
            goals: "Calculating goals...",
          }}
          isLoading={isLoadingInsights}
        />
      </div>
      <AddFoodButton />
    </div>
  );
}

export default Index;