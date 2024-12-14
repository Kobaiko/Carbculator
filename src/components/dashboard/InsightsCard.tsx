import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Target, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InsightsCardProps {
  insights: {
    trends: string;
    recommendations: string;
    goals: string;
  };
}

export function InsightsCard({ insights }: InsightsCardProps) {
  return (
    <Card className="col-span-full glass-card">
      <CardHeader className="flex flex-row items-center space-x-2">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <CardTitle>AI Insights & Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm rounded-full p-1">
            <TabsTrigger value="trends" className="flex items-center gap-2 rounded-full data-[state=active]:bg-white/80">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Trends</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2 rounded-full data-[state=active]:bg-white/80">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2 rounded-full data-[state=active]:bg-white/80">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="trends" className="mt-4">
            <p className="text-muted-foreground whitespace-pre-line">{insights.trends}</p>
          </TabsContent>
          <TabsContent value="recommendations" className="mt-4">
            <p className="text-muted-foreground whitespace-pre-line">{insights.recommendations}</p>
          </TabsContent>
          <TabsContent value="goals" className="mt-4">
            <p className="text-muted-foreground whitespace-pre-line">{insights.goals}</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}