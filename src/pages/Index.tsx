import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { TrendsChart } from "@/components/dashboard/TrendsChart";
import { Activity, Scale, Droplet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardData {
  insights: string;
  data: {
    measurements: any[];
    nutrition: any[];
    water: any[];
  };
}

const Index = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const response = await fetch("/api/generate-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) throw new Error("Failed to fetch insights");
      return response.json() as Promise<DashboardData>;
    },
  });

  const latestWeight = dashboardData?.data.measurements[0]?.weight || "N/A";
  const latestBMI = dashboardData?.data.measurements[0]?.bmi || "N/A";
  const totalWaterToday = dashboardData?.data.water
    .filter((log: any) => {
      const today = new Date().toISOString().split("T")[0];
      return log.created_at.startsWith(today);
    })
    .reduce((acc: number, log: any) => acc + log.amount, 0) || 0;

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
            icon={Droplet}
          />
        </div>

        {dashboardData?.insights && (
          <InsightsCard insights={dashboardData.insights} />
        )}

        {dashboardData?.data.measurements.length > 0 && (
          <TrendsChart
            title="Weight Trend"
            data={dashboardData.data.measurements.map((m: any) => ({
              date: new Date(m.created_at).toLocaleDateString(),
              value: m.weight,
            }))}
            color="#ef4444"
            unit="kg"
          />
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading your health data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;