import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GoalInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit: string;
  min?: string;
}

export function GoalInput({ label, value, onChange, unit, min = "1" }: GoalInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase()}>{label}</Label>
      <div className="relative">
        <Input
          id={label.toLowerCase()}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          min={min}
        />
        <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">
          {unit}
        </span>
      </div>
    </div>
  );
}