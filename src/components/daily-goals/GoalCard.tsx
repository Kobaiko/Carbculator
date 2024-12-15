import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface GoalCardProps {
  icon: LucideIcon;
  title: string;
  unit: string;
  current: number;
  target: number;
  iconColor: string;
  iconBgColor: string;
  isEditing: boolean;
  editValue: number;
  onEditChange: (value: number) => void;
}

export function GoalCard({
  icon: Icon,
  title,
  unit,
  current,
  target,
  iconColor,
  iconBgColor,
  isEditing,
  editValue,
  onEditChange,
}: GoalCardProps) {
  const calculateProgress = (current: number, target: number) => {
    if (!target) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div className="glass-card p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${iconBgColor} rounded-full`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">Daily Target: {target}{unit}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Current</div>
          <span className="text-2xl font-bold">{current}{unit}</span>
        </div>
      </div>
      <Progress value={calculateProgress(current, target)} className="h-2" />
      {isEditing && (
        <Input
          type="number"
          value={editValue}
          onChange={(e) => onEditChange(parseInt(e.target.value))}
          className="mt-2"
        />
      )}
    </div>
  );
}