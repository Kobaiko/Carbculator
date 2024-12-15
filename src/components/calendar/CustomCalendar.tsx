import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight,
  CalendarDays
} from "lucide-react";
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek
} from "date-fns";

interface CustomCalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  modifiers?: {
    goals_met: (date: Date) => boolean;
    goals_not_met: (date: Date) => boolean;
    no_meals: (date: Date) => boolean;
  };
}

export function CustomCalendar({ selected, onSelect, modifiers }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getDayClass = (date: Date) => {
    if (!isSameMonth(date, currentMonth)) {
      return "text-muted-foreground opacity-50";
    }
    
    if (modifiers?.goals_met(date)) {
      return "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-900/50";
    }
    if (modifiers?.goals_not_met(date)) {
      return "bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-900/50";
    }
    if (modifiers?.no_meals(date)) {
      return "bg-gray-100 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800";
    }
    
    return "";
  };

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth))
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden flex-1">
        <div className="col-span-7 grid grid-cols-7">
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={`p-3 text-center font-medium text-sm bg-primary/10 text-primary ${
                index === 0 ? 'rounded-tl-lg' : ''
              } ${index === 6 ? 'rounded-tr-lg' : ''}`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {days.map((day, dayIdx) => (
          <Button
            key={day.toString()}
            variant="ghost"
            className={`h-full min-h-[80px] rounded-none flex flex-col items-center justify-start p-2 hover:bg-accent ${
              selected && isSameDay(day, selected)
                ? "ring-2 ring-primary"
                : ""
            } ${getDayClass(day)}`}
            onClick={() => onSelect?.(day)}
          >
            <span className="text-sm">{format(day, "d")}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}