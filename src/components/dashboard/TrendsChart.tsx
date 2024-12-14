import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface TrendsChartProps {
  data: Array<{ date: string; value: number }>;
  title: string;
  color: string;
  unit: string;
}

export function TrendsChart({ data, title, color, unit }: TrendsChartProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
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