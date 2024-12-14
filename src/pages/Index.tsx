import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { TrendsChart } from "@/components/dashboard/TrendsChart";
import { Activity, Scale, GlassWater, Utensils } from "lucide-react";
import { mockMeasurements, mockWaterIntake, mockInsights, mockNutrition } from "@/utils/mockData";
import { TimeRange } from "@/components/dashboard/TimeRangeSelector";

const Index = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  const [dashboardData] = useState({
    insights: mockInsights,
    data: {
      measurements: mockMeasurements,
      water: mockWaterIntake,
      nutrition: mockNutrition
    }
  });

  const latestWeight = dashboardData.data.measurements[0]?.weight || "N/A";
  const latestBMI = dashboardData.data.measurements[0]?.bmi || "N/A";
  const latestNutrition = dashboardData.data.nutrition[0] || { calories: "N/A", protein: "N/A" };
  const totalWaterToday = dashboardData.data.water
    .filter((log) => {
      const today = new Date().toISOString().split("T")[0];
      return log.created_at.startsWith(today);
    })
    .reduce((acc, log) => acc + log.amount, 0);

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-b from-background to-secondary">
      <Navigation />
      <div className="max-w-7xl mx-auto space-y-6 pt-16 md:ml-16">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Health Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your progress and get personalized insights
          </p>
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
            data={dashboardData.data.measurements.map((m) => ({
              date: m.created_at,
              value: m.weight,
            }))}
            color="#ef4444"
            unit="kg"
          />
          <TrendsChart
            title="Water Intake Trend"
            data={dashboardData.data.water.map((w) => ({
              date: w.created_at,
              value: w.amount,
            }))}
            color="#3b82f6"
            unit="ml"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TrendsChart
            title="Calories Trend"
            data={dashboardData.data.nutrition.map((n) => ({
              date: n.created_at,
              value: n.calories,
            }))}
            color="#f59e0b"
            unit="kcal"
          />
          <TrendsChart
            title="Protein Intake Trend"
            data={dashboardData.data.nutrition.map((n) => ({
              date: n.created_at,
              value: n.protein,
            }))}
            color="#10b981"
            unit="g"
          />
        </div>

        <InsightsCard insights={dashboardData.insights} />
      </div>
    </div>
  );
}

export default Index;