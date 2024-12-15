import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomDateRangePicker } from "./CustomDateRangePicker";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, subDays, subWeeks, subMonths, subYears, addDays, addWeeks, addMonths, addYears } from "date-fns";

export type TimeRange = "hour" | "day" | "week" | "month" | "year" | "custom";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onValueChange: (value: TimeRange) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  customDateRange?: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    onRangeSelect: (start: Date | undefined, end: Date | undefined) => void;
  };
}

export function TimeRangeSelector({ value, onValueChange, currentDate, onDateChange, customDateRange }: TimeRangeSelectorProps) {
  const handlePrevious = () => {
    switch (value) {
      case "hour":
        onDateChange(subDays(currentDate, 1));
        break;
      case "day":
        onDateChange(subWeeks(currentDate, 1));
        break;
      case "week":
        onDateChange(subMonths(currentDate, 1));
        break;
      case "month":
        onDateChange(subYears(currentDate, 1));
        break;
      case "year":
        onDateChange(subYears(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (value) {
      case "hour":
        onDateChange(addDays(currentDate, 1));
        break;
      case "day":
        onDateChange(addWeeks(currentDate, 1));
        break;
      case "week":
        onDateChange(addMonths(currentDate, 1));
        break;
      case "month":
        onDateChange(addYears(currentDate, 1));
        break;
      case "year":
        onDateChange(addYears(currentDate, 1));
        break;
    }
  };

  const formatDateRange = () => {
    switch (value) {
      case "hour":
        return format(currentDate, "MMMM d, yyyy");
      case "day":
        return `Week of ${format(currentDate, "MMMM d, yyyy")}`;
      case "week":
        return format(currentDate, "MMMM yyyy");
      case "month":
        return format(currentDate, "yyyy");
      case "year":
        return format(currentDate, "yyyy");
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-background/50 p-4 rounded-xl border">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hour">Hour (Today)</SelectItem>
          <SelectItem value="day">Day (Week)</SelectItem>
          <SelectItem value="week">Week (Month)</SelectItem>
          <SelectItem value="month">Month (Year)</SelectItem>
          <SelectItem value="year">Year</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {value !== "custom" && (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-32 text-center">{formatDateRange()}</span>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

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