import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { TimeRange } from "./TimeRangeSelector";

interface TrendsChartProps {
  data: Array<{ date: string; value: number }>;
  title: string;
  color: string;
  unit: string;
  timeRange: TimeRange;
}

export function TrendsChart({ data, title, color, unit, timeRange }: TrendsChartProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  switch (timeRange) {
                    case "daily":
                      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    case "weekly":
                      return date.toLocaleDateString([], { weekday: 'short' });
                    case "monthly":
                      return date.toLocaleDateString([], { day: 'numeric' });
                    case "yearly":
                      return date.toLocaleDateString([], { month: 'short' });
                    default:
                      return date.toLocaleDateString();
                  }
                }}
              />
              <YAxis width={45} />
              <ChartTooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill={color}
                fillOpacity={0.2}
                name={unit}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}