import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useNutritionProgress } from "@/hooks/useNutritionProgress";
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
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Meal Calendar</h1>
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDayClick}
          className="rounded-md border shadow-sm p-4 bg-background"
          modifiers={{
            goals_met: (date) => getDayStatus(date) === "goals_met",
            goals_not_met: (date) => getDayStatus(date) === "goals_not_met",
            no_meals: (date) => getDayStatus(date) === "no_meals",
          }}
          modifiersClassNames={{
            goals_met: "bg-green-100 text-green-900 hover:bg-green-200",
            goals_not_met: "bg-red-100 text-red-900 hover:bg-red-200",
            no_meals: "bg-gray-100 text-gray-900 hover:bg-gray-200",
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