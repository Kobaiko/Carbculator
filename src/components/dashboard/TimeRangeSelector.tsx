import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type TimeRange = "daily" | "weekly" | "monthly" | "yearly" | "custom";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onValueChange: (value: TimeRange) => void;
}

export function TimeRangeSelector({ value, onValueChange }: TimeRangeSelectorProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(value) => value && onValueChange(value as TimeRange)}
      className="justify-start"
    >
      <ToggleGroupItem value="daily" aria-label="Daily view">
        Daily
      </ToggleGroupItem>
      <ToggleGroupItem value="weekly" aria-label="Weekly view">
        Weekly
      </ToggleGroupItem>
      <ToggleGroupItem value="monthly" aria-label="Monthly view">
        Monthly
      </ToggleGroupItem>
      <ToggleGroupItem value="yearly" aria-label="Yearly view">
        Yearly
      </ToggleGroupItem>
      <ToggleGroupItem value="custom" aria-label="Custom range">
        Custom
      </ToggleGroupItem>
    </ToggleGroup>
  );
}