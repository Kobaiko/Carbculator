import { TrendsChart } from "./TrendsChart";
import { TimeRange } from "./TimeRangeSelector";

interface MacroTrendsProps {
  timeRange: TimeRange;
  caloriesData: Array<{ date: string; value: number }>;
  macrosData: Array<{ date: string; protein: number; carbs: number; fats: number }>;
  waterData: Array<{ date: string; value: number }>;
}

export function MacroTrends({ timeRange, caloriesData, macrosData, waterData }: MacroTrendsProps) {
  // Transform macros data for individual charts
  const proteinData = macrosData.map(entry => ({
    date: entry.date,
    value: entry.protein
  }));

  const carbsData = macrosData.map(entry => ({
    date: entry.date,
    value: entry.carbs
  }));

  const fatsData = macrosData.map(entry => ({
    date: entry.date,
    value: entry.fats
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TrendsChart
        title="Calories Trend"
        data={caloriesData}
        color="hsl(var(--primary))"
        unit="kcal"
        timeRange={timeRange}
      />
      <TrendsChart
        title="Protein Trend"
        data={proteinData}
        color="#3b82f6"
        unit="g"
        timeRange={timeRange}
      />
      <TrendsChart
        title="Carbs Trend"
        data={carbsData}
        color="#22c55e"
        unit="g"
        timeRange={timeRange}
      />
      <TrendsChart
        title="Fats Trend"
        data={fatsData}
        color="#eab308"
        unit="g"
        timeRange={timeRange}
      />
      <TrendsChart
        title="Water Intake Trend"
        data={waterData}
        color="#0ea5e9"
        unit="ml"
        timeRange={timeRange}
      />
    </div>
  );
}