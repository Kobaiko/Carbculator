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
import { GoalCard } from "@/components/daily-goals/GoalCard";
import { Flame, Dumbbell, Wheat, Droplets } from "lucide-react";
import { useNutritionProgress } from "@/hooks/useNutritionProgress";

interface DayDetailsDialogProps {
  date: Date | undefined;
  onClose: () => void;
}

export function DayDetailsDialog({ date, onClose }: DayDetailsDialogProps) {
  const { getDayMeals } = useDayStatus();
  const { goals } = useNutritionProgress();
  const meals = date ? getDayMeals(date) : [];

  const dailyTotals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + Number(meal.protein),
      carbs: acc.carbs + Number(meal.carbs),
      fats: acc.fats + Number(meal.fats),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  if (!date) return null;

  return (
    <Dialog open={!!date} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {format(date, "EEEE, MMMM do, yyyy")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <GoalCard
            icon={Flame}
            title="Calories"
            unit=" kcal"
            current={dailyTotals.calories}
            target={goals.calories}
            iconColor="text-orange-500"
            iconBgColor="bg-orange-500/10"
            isEditing={false}
            editValue={0}
            onEditChange={() => {}}
          />
          <GoalCard
            icon={Dumbbell}
            title="Protein"
            unit="g"
            current={dailyTotals.protein}
            target={goals.protein}
            iconColor="text-blue-500"
            iconBgColor="bg-blue-500/10"
            isEditing={false}
            editValue={0}
            onEditChange={() => {}}
          />
          <GoalCard
            icon={Wheat}
            title="Carbs"
            unit="g"
            current={dailyTotals.carbs}
            target={goals.carbs}
            iconColor="text-amber-500"
            iconBgColor="bg-amber-500/10"
            isEditing={false}
            editValue={0}
            onEditChange={() => {}}
          />
          <GoalCard
            icon={Droplets}
            title="Fats"
            unit="g"
            current={dailyTotals.fats}
            target={goals.fats}
            iconColor="text-green-500"
            iconBgColor="bg-green-500/10"
            isEditing={false}
            editValue={0}
            onEditChange={() => {}}
          />
        </div>

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