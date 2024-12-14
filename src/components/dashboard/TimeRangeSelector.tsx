import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomDateRangePicker } from "./CustomDateRangePicker";

export type TimeRange = "daily" | "weekly" | "monthly" | "yearly" | "custom";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onValueChange: (value: TimeRange) => void;
  customDateRange?: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    onRangeSelect: (start: Date | undefined, end: Date | undefined) => void;
  };
}

export function TimeRangeSelector({ value, onValueChange, customDateRange }: TimeRangeSelectorProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="yearly">Yearly</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>
      {value === "custom" && customDateRange && (
        <CustomDateRangePicker
          startDate={customDateRange.startDate}
          endDate={customDateRange.endDate}
          onRangeSelect={customDateRange.onRangeSelect}
        />
      )}
    </div>
  );
}