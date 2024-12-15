import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { DayDetailsDialog } from "@/components/calendar/DayDetailsDialog";
import { useDayStatus } from "@/hooks/useDayStatus";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { getDayStatus, getDayMeals } = useDayStatus();

  const handleDayClick = (date: Date | undefined) => {
    if (date && getDayMeals(date).length > 0) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background">
      <div className="w-full max-w-3xl p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDayClick}
          className="rounded-md border shadow-lg p-4 bg-background"
          modifiers={{
            goals_met: (date) => getDayStatus(date) === "goals_met",
            goals_not_met: (date) => getDayStatus(date) === "goals_not_met",
            no_meals: (date) => getDayStatus(date) === "no_meals",
          }}
          modifiersClassNames={{
            goals_met: "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-900/50",
            goals_not_met: "bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-900/50",
            no_meals: "bg-gray-100 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800",
          }}
        />
      </div>
      <DayDetailsDialog
        date={selectedDate}
        onClose={() => setSelectedDate(undefined)}
      />
    </div>
  );
}