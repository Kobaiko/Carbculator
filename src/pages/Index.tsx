import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { TrendsChart } from "@/components/dashboard/TrendsChart";
import { Activity, Scale, GlassWater } from "lucide-react";
import { mockMeasurements, mockWaterIntake, mockInsights } from "@/utils/mockData";

const Index = () => {
  const [dashboardData, setDashboardData] = useState({
    insights: mockInsights,
    data: {
      measurements: mockMeasurements,
      water: mockWaterIntake
    }
  });

  const latestWeight = dashboardData.data.measurements[0]?.weight || "N/A";
  const latestBMI = dashboardData.data.measurements[0]?.bmi || "N/A";
  const totalWaterToday = dashboardData.data.water
    .filter((log: any) => {
      const today = new Date().toISOString().split("T")[0];
      return log.created_at.startsWith(today);
    })
    .reduce((acc: number, log: any) => acc + log.amount, 0);

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-b from-background to-secondary">
      <Navigation />
      <div className="max-w-7xl mx-auto space-y-6 pt-16 md:ml-16">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Health Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your progress and get personalized insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        {dashboardData.data.measurements.length > 0 && (
          <TrendsChart
            title="Weight Trend"
            data={dashboardData.data.measurements.map((m: any) => ({
              date: m.created_at,
              value: m.weight,
            }))}
            color="#ef4444"
            unit="kg"
          />
        )}

        {dashboardData.data.water.length > 0 && (
          <TrendsChart
            title="Water Intake Trend"
            data={dashboardData.data.water.map((w: any) => ({
              date: w.created_at,
              value: w.amount,
            }))}
            color="#3b82f6"
            unit="ml"
          />
        )}

        {dashboardData.insights && (
          <InsightsCard insights={dashboardData.insights} />
        )}
      </div>
    </div>
  );
}

export default Index;