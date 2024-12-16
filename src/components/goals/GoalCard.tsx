import { Goal } from "@/types/goals.types";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface GoalCardProps extends Goal {
  isEditing: boolean;
  editedValue?: number;
  onEdit?: (value: string) => void;
}

export function GoalCard({
  title,
  current,
  target,
  icon: Icon,
  iconColor,
  bgColor,
  field,
  isEditing,
  editedValue,
  onEdit,
}: GoalCardProps) {
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
            <p className="text-sm text-muted-foreground">
              Daily Target: {target}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Current</div>
          <span className="text-2xl font-bold">{current}</span>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      {isEditing && onEdit && (
        <Input
          type="number"
          min="0"
          value={editedValue || 0}
          onChange={(e) => onEdit(e.target.value)}
          className="mt-2"
        />
      )}
    </div>
  );
}