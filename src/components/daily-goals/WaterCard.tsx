import { Progress } from "@/components/ui/progress";
import { GlassWater } from "lucide-react";

interface WaterCardProps {
  current: number;
  target: number;
}

export function WaterCard({ current, target }: WaterCardProps) {
  const calculateProgress = (current: number, target: number) => {
    if (!target) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div className="glass-card p-6 rounded-2xl space-y-4 md:col-span-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-full">
            <GlassWater className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold">Water Intake</h3>
            <p className="text-sm text-muted-foreground">Daily Target: {target}ml</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Current</div>
          <span className="text-2xl font-bold">{current}ml</span>
        </div>
      </div>
      <Progress value={calculateProgress(current, target)} className="h-2" />
    </div>
  );
}