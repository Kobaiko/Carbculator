import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDayStatus } from "@/hooks/useDayStatus";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MealCard } from "@/components/meals/MealCard";

interface DayDetailsDialogProps {
  date: Date | undefined;
  onClose: () => void;
}

export function DayDetailsDialog({ date, onClose }: DayDetailsDialogProps) {
  const { getDayMeals } = useDayStatus();
  const meals = date ? getDayMeals(date) : [];

  if (!date) return null;

  return (
    <Dialog open={!!date} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Meals for {format(date, "EEEE, MMMM do, yyyy")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onDelete={() => {}}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}