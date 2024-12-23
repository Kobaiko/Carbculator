import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Target, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface InsightsCardProps {
  insights: {
    trends: string;
    recommendations: string;
    goals: string;
  };
  isLoading?: boolean;
}

const formatInsightText = (text: string) => {
  // Remove markdown headers more thoroughly
  const withoutHeaders = text.replace(/###\s*(?:\d+\.)?\s*(?:Trends|Recommendations|Goals)[^\n]*/gi, '').trim();
  
  // Add line breaks after periods, but not after decimal numbers
  const withLineBreaks = withoutHeaders.replace(/\.(?!\d)\s+/g, '.<br>');
  
  // Split text into bullet points if they exist
  const bulletPoints = withLineBreaks.split(/(?:\r?\n|\r)(?=[-•*])/g);
  
  // Convert **text** to bold and handle bullet points
  const formattedPoints = bulletPoints.map(point => {
    // Convert **text** to bold
    const withBoldText = point.replace(/\*\*([^*]+)\*\*/g, (_, content) => {
      return `<strong class="font-semibold text-primary">${content}</strong>`;
    });

    // Add proper bullet point styling
    if (point.trim().startsWith('-') || point.trim().startsWith('•') || point.trim().startsWith('*')) {
      return `<div class="flex gap-2 mb-3">
                <span class="text-primary">•</span>
                <span>${withBoldText.replace(/^[-•*]\s*/, '')}</span>
              </div>`;
    }
    
    return `<div class="mb-3">${withBoldText}</div>`;
  });

  return formattedPoints.join('');
};

export function InsightsCard({ insights, isLoading }: InsightsCardProps) {
  return (
    <Card className="col-span-full glass-card">
      <CardHeader className="flex flex-row items-center space-x-2">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <CardTitle>AI Insights & Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm rounded-full p-1">
            <TabsTrigger value="trends" className="flex flex-col items-center gap-1 rounded-full data-[state=active]:bg-white/80">
              <TrendingUp className="h-4 w-4" />
              <span className="sm:hidden text-[10px] font-medium">Trends</span>
              <span className="hidden sm:inline">Trends</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex flex-col items-center gap-1 rounded-full data-[state=active]:bg-white/80">
              <Activity className="h-4 w-4" />
              <span className="sm:hidden text-[10px] font-medium">Insights</span>
              <span className="hidden sm:inline">Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex flex-col items-center gap-1 rounded-full data-[state=active]:bg-white/80">
              <Target className="h-4 w-4" />
              <span className="sm:hidden text-[10px] font-medium">Goals</span>
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="trends" className="mt-4 space-y-2">
            {isLoading ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            ) : (
              <div 
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatInsightText(insights.trends) }}
              />
            )}
          </TabsContent>
          <TabsContent value="recommendations" className="mt-4 space-y-2">
            {isLoading ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            ) : (
              <div 
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatInsightText(insights.recommendations) }}
              />
            )}
          </TabsContent>
          <TabsContent value="goals" className="mt-4 space-y-2">
            {isLoading ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            ) : (
              <div 
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatInsightText(insights.goals) }}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}