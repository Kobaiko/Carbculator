import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Legend, Line, ComposedChart } from "recharts";
import { TimeRange } from "./TimeRangeSelector";
import { format } from "date-fns";

interface TrendsChartProps {
  data: Array<{ date: string; value?: number; protein?: number; carbs?: number; fats?: number }>;
  title: string;
  color: string;
  unit: string;
  timeRange: TimeRange;
  showMultipleLines?: boolean;
}

const formatDate = (dateStr: string, timeRange: TimeRange) => {
  const date = new Date(dateStr);
  switch (timeRange) {
    case "daily":
      return format(date, "HH:mm");
    case "weekly":
      return format(date, "EEE");
    case "monthly":
      return format(date, "d MMM");
    case "yearly":
      return format(date, "MMM");
    default:
      return format(date, "PP");
  }
};

export function TrendsChart({ data, title, color, unit, timeRange, showMultipleLines }: TrendsChartProps) {
  if (showMultipleLines) {
    return (
      <Card className="w-full glass-card">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProtein" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCarbs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => formatDate(value, timeRange)}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  width={45}
                  stroke="hsl(var(--muted-foreground))"
                />
                <ChartTooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="protein"
                  name="Protein"
                  stroke="#3b82f6"
                  fill="url(#colorProtein)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="carbs"
                  name="Carbs"
                  stroke="#22c55e"
                  fill="url(#colorCarbs)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="fats"
                  name="Fats"
                  stroke="#eab308"
                  fill="url(#colorFats)"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full glass-card">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date"
                tickFormatter={(value) => formatDate(value, timeRange)}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                width={45}
                stroke="hsl(var(--muted-foreground))"
              />
              <ChartTooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill="url(#colorValue)"
                strokeWidth={2}
                name={unit}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}