import { useState } from "react";
import { DayDetailsDialog } from "@/components/calendar/DayDetailsDialog";
import { useDayStatus } from "@/hooks/useDayStatus";
import { CustomCalendar } from "@/components/calendar/CustomCalendar";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { getDayStatus, getDayMeals } = useDayStatus();

  const handleDayClick = (date: Date) => {
    if (getDayMeals(date).length > 0) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background">
      <div className="absolute inset-4 md:inset-8 lg:inset-12">
        <div className="w-full h-full glass-card p-4 md:p-6 lg:p-8 rounded-3xl shadow-xl">
          <CustomCalendar
            selected={selectedDate}
            onSelect={handleDayClick}
            modifiers={{
              goals_met: (date) => getDayStatus(date) === "goals_met",
              goals_not_met: (date) => getDayStatus(date) === "goals_not_met",
              no_meals: (date) => getDayStatus(date) === "no_meals",
            }}
          />
        </div>
      </div>
      <DayDetailsDialog
        date={selectedDate}
        onClose={() => setSelectedDate(undefined)}
      />
    </div>
  );
}