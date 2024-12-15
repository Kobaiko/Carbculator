import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AddFoodDialog } from "./food/AddFoodDialog";
import type { FoodAnalysis } from "@/services/openai";

export function AddFoodButton() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleAddMeal = async (analysis: FoodAnalysis, imageUrl: string, quantity: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Save to database with quantity
      const { error: dbError } = await supabase
        .from("food_entries")
        .insert({
          name: analysis.name,
          ingredients: analysis.ingredients,
          calories: analysis.calories * quantity,
          protein: analysis.protein * quantity,
          carbs: analysis.carbs * quantity,
          fats: analysis.fats * quantity,
          health_score: analysis.healthScore,
          image_url: imageUrl,
          user_id: user.id,
          quantity: quantity,
        });

      if (dbError) throw dbError;

      // Invalidate the meals query to trigger a refresh
      await queryClient.invalidateQueries({ queryKey: ["meals"] });

      toast({
        title: "Success!",
        description: "Added to your daily meals.",
      });
      
      // Navigate to daily meals page and ensure the new data is shown
      navigate("/meals");
    } catch (error) {
      console.error("Error saving to meals:", error);
      toast({
        title: "Error",
        description: "Failed to add to daily meals. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-[9999]"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddFoodDialog
        open={open}
        onOpenChange={setOpen}
        onAddMeal={handleAddMeal}
      />
    </>
  );
}