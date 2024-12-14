import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface CustomDateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onRangeSelect: (start: Date | undefined, end: Date | undefined) => void;
}

export function CustomDateRangePicker({ startDate, endDate, onRangeSelect }: CustomDateRangePickerProps) {
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  return (
    <div className="flex gap-2 items-center">
      <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "PPP") : "Pick start date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={(date) => {
              onRangeSelect(date, endDate);
              setIsStartDateOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <span>to</span>
      <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "PPP") : "Pick end date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={(date) => {
              onRangeSelect(startDate, date);
              setIsEndDateOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}