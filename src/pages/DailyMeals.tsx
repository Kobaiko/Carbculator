import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2, Flame, Dumbbell, Wheat, Droplets } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AddFoodButton } from "@/components/AddFoodButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useState } from "react";

export default function DailyMeals() {
  const { toast } = useToast();
  const [mealToDelete, setMealToDelete] = useState<string | null>(null);

  const { data: meals, refetch } = useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("food_entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("food_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meal deleted successfully",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete meal",
        variant: "destructive",
      });
    }
    setMealToDelete(null);
  };

  // Calculate daily totals
  const dailyTotals = meals?.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  ) || { calories: 0, protein: 0, carbs: 0, fats: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary pb-16">
      <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-6 pt-6 md:pt-8 md:ml-20">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Daily Meals</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Calories"
            value={dailyTotals.calories}
            icon={Flame}
            className="bg-orange-500/10"
          />
          <StatsCard
            title="Total Protein"
            value={`${dailyTotals.protein}g`}
            icon={Dumbbell}
            className="bg-blue-500/10"
          />
          <StatsCard
            title="Total Carbs"
            value={`${dailyTotals.carbs}g`}
            icon={Wheat}
            className="bg-amber-500/10"
          />
          <StatsCard
            title="Total Fats"
            value={`${dailyTotals.fats}g`}
            icon={Droplets}
            className="bg-green-500/10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals?.map((meal) => (
            <div
              key={meal.id}
              className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg group"
            >
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
                    onClick={() => setMealToDelete(meal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
          ))}
        </div>
      </div>

      <AlertDialog open={!!mealToDelete} onOpenChange={() => setMealToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the meal
              from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Don't delete</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => mealToDelete && handleDelete(mealToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, delete this meal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddFoodButton />
    </div>
  );
}