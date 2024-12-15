import { format } from "date-fns";

interface MealHeaderProps {
  meal: {
    name: string;
    created_at: string;
  };
}

export function MealHeader({ meal }: MealHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold">{meal.name}</h3>
        <p className="text-sm text-muted-foreground">
          {format(new Date(meal.created_at), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </div>
  );
}