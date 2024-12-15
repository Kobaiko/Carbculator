import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MacroNutrients } from "./MacroNutrients";
import { MealHeader } from "./MealHeader";
import { MealIngredients } from "./MealIngredients";

interface MealCardProps {
  meal: any;
  onDelete: (id: string) => void;
  compact?: boolean;
  extraCompact?: boolean;
}

export function MealCard({ meal, onDelete, compact = false, extraCompact = false }: MealCardProps) {
  return (
    <div className={`glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg group ${compact ? 'text-sm' : ''} ${extraCompact ? 'text-xs' : ''}`}>
      <div className="flex">
        {meal.image_url && (
          <div className={`relative ${extraCompact ? 'w-20 md:w-24' : 'w-32 md:w-48'} shrink-0`}>
            <img
              src={meal.image_url}
              alt={meal.name}
              className="w-full h-full object-cover"
            />
            {!compact && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete(meal.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            {meal.quantity > 1 && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-xs md:text-sm font-medium">
                x{meal.quantity}
              </div>
            )}
          </div>
        )}
        <div className={`flex-1 p-1.5 md:p-2 ${compact ? 'space-y-0.5 md:space-y-1' : 'space-y-2 md:space-y-4'} ${extraCompact ? '!space-y-0.5' : ''}`}>
          <MealHeader meal={meal} />
          <MacroNutrients meal={meal} />
          {!extraCompact && <MealIngredients ingredients={meal.ingredients} />}
        </div>
      </div>
    </div>
  );
}