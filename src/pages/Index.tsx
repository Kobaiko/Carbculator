import { useState, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { TrendsChart } from "@/components/dashboard/TrendsChart";
import { Activity, Scale, GlassWater, Utensils } from "lucide-react";
import { mockMeasurements, mockWaterIntake, mockInsights, mockNutrition } from "@/utils/mockData";
import { TimeRange, TimeRangeSelector } from "@/components/dashboard/TimeRangeSelector";
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

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

  const filterDataByDateRange = (data: any[]) => {
    const { start, end } = getDateRange();
    return data.filter((item) => {
      const date = new Date(item.created_at);
      return date >= start && date <= end;
    });
  };

  const filteredData = useMemo(() => ({
    measurements: filterDataByDateRange(mockMeasurements),
    water: filterDataByDateRange(mockWaterIntake),
    nutrition: filterDataByDateRange(mockNutrition),
  }), [timeRange, customStartDate, customEndDate]);

  const latestWeight = filteredData.measurements[filteredData.measurements.length - 1]?.weight || "N/A";
  const latestBMI = filteredData.measurements[filteredData.measurements.length - 1]?.bmi || "N/A";
  const latestNutrition = filteredData.nutrition[filteredData.nutrition.length - 1] || { calories: "N/A", protein: "N/A" };
  const totalWaterToday = filteredData.water
    .filter((log) => {
      const today = new Date().toISOString().split("T")[0];
      return log.created_at.startsWith(today);
    })
    .reduce((acc, log) => acc + log.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary pb-16">
      <Navigation />
      <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-6 pt-6 md:pt-8 md:ml-16">
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
            title="Current Weight"
            value={`${latestWeight} kg`}
            icon={Scale}
          />
          <StatsCard
            title="BMI"
            value={latestBMI}
            icon={Activity}
          />
          <StatsCard
            title="Water Intake Today"
            value={`${totalWaterToday} ml`}
            icon={GlassWater}
          />
          <StatsCard
            title="Calories Today"
            value={`${latestNutrition.calories} kcal`}
            icon={Utensils}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TrendsChart
            title="Weight Trend"
            data={filteredData.measurements.map((m) => ({
              date: m.created_at,
              value: m.weight,
            }))}
            color="#ef4444"
            unit="kg"
            timeRange={timeRange}
          />
          <TrendsChart
            title="Water Intake Trend"
            data={filteredData.water.map((w) => ({
              date: w.created_at,
              value: w.amount,
            }))}
            color="#3b82f6"
            unit="ml"
            timeRange={timeRange}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TrendsChart
            title="Calories Trend"
            data={filteredData.nutrition.map((n) => ({
              date: n.created_at,
              value: n.calories,
            }))}
            color="#f59e0b"
            unit="kcal"
            timeRange={timeRange}
          />
          <TrendsChart
            title="Protein Intake Trend"
            data={filteredData.nutrition.map((n) => ({
              date: n.created_at,
              value: n.protein,
            }))}
            color="#10b981"
            unit="g"
            timeRange={timeRange}
          />
        </div>

        <InsightsCard insights={mockInsights} />
      </div>
    </div>
  );
}

export default Index;
