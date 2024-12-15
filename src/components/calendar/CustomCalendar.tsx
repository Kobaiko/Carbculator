import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight,
  CalendarDays,
  Circle
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
      return "bg-green-100/80 dark:bg-green-900/30 text-green-900 dark:text-green-100 hover:bg-green-200/80 dark:hover:bg-green-900/50 backdrop-blur-sm";
    }
    if (modifiers?.goals_not_met(date)) {
      return "bg-red-100/80 dark:bg-red-900/30 text-red-900 dark:text-red-100 hover:bg-red-200/80 dark:hover:bg-red-900/50 backdrop-blur-sm";
    }
    if (modifiers?.no_meals(date)) {
      return "bg-gray-100/80 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 hover:bg-gray-200/80 dark:hover:bg-gray-800/70 backdrop-blur-sm";
    }
    
    return "";
  };

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth))
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full h-full flex flex-col pt-16 md:pt-0">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <div className="flex items-center gap-1 md:gap-2">
          <CalendarDays className="h-4 w-4 md:h-5 md:w-5" />
          <h2 className="text-base md:text-2xl font-semibold truncate">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 md:h-10 md:w-10 bg-white/50 dark:bg-black/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-black/70"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 md:h-10 md:w-10 bg-white/50 dark:bg-black/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-black/70"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-muted/50 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 dark:border-black/20">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`flex items-center justify-center text-center p-2 font-medium text-[10px] md:text-sm bg-primary/5 backdrop-blur-sm text-primary ${
              index === 0 ? 'rounded-tl-lg' : ''
            } ${index === 6 ? 'rounded-tr-lg' : ''}`}
          >
            {day}
          </div>
        ))}
        
        {days.map((day, dayIdx) => {
          const isLastWeekFirstDay = dayIdx >= days.length - 7 && dayIdx % 7 === 0;
          return (
            <Button
              key={day.toString()}
              variant="ghost"
              className={`aspect-square w-full p-0 rounded-none flex flex-col items-center justify-start hover:bg-accent/50 backdrop-blur-sm ${
                selected && isSameDay(day, selected)
                  ? "ring-2 ring-primary"
                  : ""
              } ${getDayClass(day)} ${
                isLastWeekFirstDay ? "rounded-bl-lg" : ""
              }`}
              onClick={() => onSelect?.(day)}
            >
              <span className="text-xs md:text-sm font-normal">{format(day, "d")}</span>
            </Button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 mt-3 md:mt-4 text-[10px] md:text-sm px-2">
        <div className="flex items-center gap-1.5">
          <Circle className="h-2 md:h-3 w-2 md:w-3 fill-green-100 text-green-100 dark:fill-green-900 dark:text-green-900" />
          <span>Goals Met</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Circle className="h-2 md:h-3 w-2 md:w-3 fill-red-100 text-red-100 dark:fill-red-900 dark:text-red-900" />
          <span>Goals Not Met</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Circle className="h-2 md:h-3 w-2 md:w-3 fill-gray-100 text-gray-100 dark:fill-gray-800 dark:text-gray-800" />
          <span>No Meals</span>
        </div>
      </div>
    </div>
  );
}