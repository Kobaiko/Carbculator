import { TrendsChart } from "./TrendsChart";
import { TimeRange } from "./TimeRangeSelector";

interface MacroTrendsProps {
  timeRange: TimeRange;
  caloriesData: Array<{ date: string; value: number }>;
  macrosData: Array<{ date: string; protein: number; carbs: number; fats: number }>;
  waterData: Array<{ date: string; value: number }>;
}

export function MacroTrends({ timeRange, caloriesData, macrosData, waterData }: MacroTrendsProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <TrendsChart
        title="Calories Trend"
        data={caloriesData}
        color="hsl(var(--primary))"
        unit="kcal"
        timeRange={timeRange}
      />
      <TrendsChart
        title="Macronutrients Trend"
        data={macrosData}
        color="hsl(var(--primary))"
        unit="g"
        timeRange={timeRange}
        showMultipleLines
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