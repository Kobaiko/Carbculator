interface MacroNutrientsProps {
  meal: {
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
  };
}

export function MacroNutrients({ meal }: MacroNutrientsProps) {
  return (
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
  );
}