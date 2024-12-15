import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MealCardProps {
  meal: any;
  onDelete: (id: string) => void;
}

export function MealCard({ meal, onDelete }: MealCardProps) {
  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg group">
      {meal.image_url && (
        <div className="relative aspect-video">
          <img
            src={meal.image_url}
            alt={meal.name}
            className="w-full h-full object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(meal.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {meal.quantity > 1 && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm font-medium">
              x{meal.quantity}
            </div>
          )}
        </div>
      )}
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{meal.name}</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(meal.created_at), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-lg font-semibold">{meal.calories}</p>
            <p className="text-xs text-muted-foreground">Calories</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">{meal.protein}g</p>
            <p className="text-xs text-muted-foreground">Protein</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">{meal.fats}g</p>
            <p className="text-xs text-muted-foreground">Fat</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">{meal.carbs}g</p>
            <p className="text-xs text-muted-foreground">Carbs</p>
          </div>
        </div>

        {meal.ingredients && (
          <p className="text-sm text-muted-foreground">
            {meal.ingredients.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}