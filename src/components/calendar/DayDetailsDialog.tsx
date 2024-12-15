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
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface DayDetailsDialogProps {
  date: Date | undefined;
  onClose: () => void;
}

export function DayDetailsDialog({ date, onClose }: DayDetailsDialogProps) {
  const { toast } = useToast();
  const { getDayMeals } = useDayStatus();
  const { goals } = useNutritionProgress();
  
  const meals = date ? getDayMeals(date) : [];

  const dailyTotals = meals.reduce(
    (acc, meal) => {
      try {
        return {
          calories: acc.calories + (meal.calories || 0),
          protein: acc.protein + (Number(meal.protein) || 0),
          carbs: acc.carbs + (Number(meal.carbs) || 0),
          fats: acc.fats + (Number(meal.fats) || 0),
        };
      } catch (error) {
        console.error("Error calculating meal totals:", error);
        toast({
          title: "Error",
          description: "There was an error calculating meal totals",
          variant: "destructive",
        });
        return acc;
      }
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  if (!date) return null;

  return (
    <Dialog open={!!date} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl h-[90vh] p-0 gap-0">
        <style>{`
          [data-radix-popper-content-wrapper] > div:has(> .radix-dialog-close) {
            display: none;
          }
        `}</style>
        <div className="flex flex-col h-full">
          <DialogHeader className="p-4 md:p-6 border-b shrink-0">
            <DialogTitle className="text-lg md:text-xl">
              {format(date, "EEEE, MMMM do, yyyy")}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-4 md:px-6">
            <div className="py-4 md:py-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <div className="space-y-3">
                {meals.map((meal) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    onDelete={() => {}}
                    compact
                    extraCompact
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 border-t mt-auto shrink-0">
            <Button 
              variant="ghost"
              className="w-full"
              onClick={() => onClose()}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}