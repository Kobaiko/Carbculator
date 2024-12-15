interface MealIngredientsProps {
  ingredients: string[];
}

export function MealIngredients({ ingredients }: MealIngredientsProps) {
  if (!ingredients?.length) return null;
  
  return (
    <p className="text-sm text-muted-foreground">
      {ingredients.join(", ")}
    </p>
  );
}