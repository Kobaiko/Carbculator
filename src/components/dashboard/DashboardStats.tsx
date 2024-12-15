import { StatsCard } from "./StatsCard";
import { Flame, Dumbbell, Wheat, Droplets } from "lucide-react";
import { TimeRange } from "./TimeRangeSelector";

interface DashboardStatsProps {
  timeRange: TimeRange;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    water: number;
  };
  goals?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    water: number;
  };
}

export function DashboardStats({ timeRange, totals, goals }: DashboardStatsProps) {
  const getStatsCardValue = (value: number, goal?: number) => {
    if (timeRange === "daily" && goal) {
      return `${value} / ${goal}`;
    }
    return value.toString();
  };

  const getStatsCardDescription = (value: number, goal?: number) => {
    if (timeRange === "daily" && goal) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatsCard
        title="Calories"
        value={getStatsCardValue(totals.calories, timeRange === "daily" ? goals?.calories : undefined)}
        description={getStatsCardDescription(totals.calories, timeRange === "daily" ? goals?.calories : undefined)}
        icon={Flame}
        className="bg-gradient-to-br from-orange-500/10 to-amber-500/10"
      />
      <StatsCard
        title="Protein"
        value={getStatsCardValue(totals.protein, timeRange === "daily" ? goals?.protein : undefined)}
        description={getStatsCardDescription(totals.protein, timeRange === "daily" ? goals?.protein : undefined)}
        icon={Dumbbell}
        className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
      />
      <StatsCard
        title="Carbs"
        value={getStatsCardValue(totals.carbs, timeRange === "daily" ? goals?.carbs : undefined)}
        description={getStatsCardDescription(totals.carbs, timeRange === "daily" ? goals?.carbs : undefined)}
        icon={Wheat}
        className="bg-gradient-to-br from-green-500/10 to-emerald-500/10"
      />
      <StatsCard
        title="Fats"
        value={getStatsCardValue(totals.fats, timeRange === "daily" ? goals?.fats : undefined)}
        description={getStatsCardDescription(totals.fats, timeRange === "daily" ? goals?.fats : undefined)}
        icon={Droplets}
        className="bg-gradient-to-br from-purple-500/10 to-pink-500/10"
      />
      <StatsCard
        title="Water"
        value={getStatsCardValue(totals.water, timeRange === "daily" ? goals?.water : undefined)}
        description={getStatsCardDescription(totals.water, timeRange === "daily" ? goals?.water : undefined)}
        icon={Droplets}
        className="bg-gradient-to-br from-blue-500/10 to-sky-500/10"
      />
    </div>
  );
}