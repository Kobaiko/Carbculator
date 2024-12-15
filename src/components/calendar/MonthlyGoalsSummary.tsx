import { useMemo } from "react";
import { useDayStatus } from "@/hooks/useDayStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Calendar, TrendingUp } from "lucide-react";
import { startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

interface MonthlyGoalsSummaryProps {
  currentMonth: Date;
}

export function MonthlyGoalsSummary({ currentMonth }: MonthlyGoalsSummaryProps) {
  const { getDayStatus } = useDayStatus();

  const monthStats = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start, end });

    const stats = daysInMonth.reduce(
      (acc, day) => {
        const status = getDayStatus(day);
        return {
          ...acc,
          [status]: acc[status] + 1,
        };
      },
      { goals_met: 0, goals_not_met: 0, no_meals: 0 }
    );

    const totalDaysWithMeals = stats.goals_met + stats.goals_not_met;
    const successRate = totalDaysWithMeals > 0 
      ? Math.round((stats.goals_met / totalDaysWithMeals) * 100) 
      : 0;

    return {
      ...stats,
      successRate,
      totalDays: daysInMonth.length,
    };
  }, [currentMonth, getDayStatus]);

  return (
    <Card className="glass-card mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          Monthly Goals Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Goals Met</p>
              <p className="text-2xl font-bold">{monthStats.goals_met}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-full">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Goals Missed</p>
              <p className="text-2xl font-bold">{monthStats.goals_not_met}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">{monthStats.successRate}%</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly Progress</span>
            <span className="font-medium">{monthStats.goals_met} / {monthStats.totalDays} days</span>
          </div>
          <Progress 
            value={(monthStats.goals_met / monthStats.totalDays) * 100} 
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}