import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface InsightsCardProps {
  insights: string;
}

export function InsightsCard({ insights }: InsightsCardProps) {
  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center space-x-2">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <CardTitle>AI Insights & Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-line">{insights}</p>
      </CardContent>
    </Card>
  );
}