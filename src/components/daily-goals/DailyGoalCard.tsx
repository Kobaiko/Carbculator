import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface DailyGoalCardProps {
  icon: LucideIcon;
  title: string;
  current: number;
  target: number;
  field: string;
  iconColor: string;
  bgColor: string;
  isEditing: boolean;
  editedGoals: any;
  handleChange: (field: string, value: string) => void;
}

export function DailyGoalCard({
  icon: Icon,
  title,
  current,
  target,
  field,
  iconColor,
  bgColor,
  isEditing,
  editedGoals,
  handleChange,
}: DailyGoalCardProps) {
  const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  return (
    <div className="glass-card p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${bgColor} rounded-full`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            {!isEditing && (
              <p className="text-sm text-muted-foreground">
                Daily Target: {target}
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Current</div>
          <span className="text-2xl font-bold">{current}</span>
        </div>
      </div>

      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {isEditing && (
        <Input
          type="number"
          min="0"
          value={editedGoals?.[field] || 0}
          onChange={(e) => handleChange(field, e.target.value)}
          className="mt-2"
        />
      )}
    </div>
  );
}