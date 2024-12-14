import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function GoalsForm({ onNext }: { onNext: () => void }) {
  const [calories, setCalories] = useState("2000");
  const [protein, setProtein] = useState("150");
  const [carbs, setCarbs] = useState("250");
  const [fats, setFats] = useState("70");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          daily_calories: Number(calories),
          daily_protein: Number(protein),
          daily_carbs: Number(carbs),
          daily_fats: Number(fats),
        })
        .eq("id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your goals have been saved.",
      });
      onNext();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to save goals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Daily Calories (kcal)</Label>
          <Input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
            min="500"
            max="10000"
            placeholder="2000"
          />
        </div>

        <div className="space-y-2">
          <Label>Daily Protein (g)</Label>
          <Input
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            required
            min="0"
            max="500"
            placeholder="150"
          />
        </div>

        <div className="space-y-2">
          <Label>Daily Carbs (g)</Label>
          <Input
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            required
            min="0"
            max="1000"
            placeholder="250"
          />
        </div>

        <div className="space-y-2">
          <Label>Daily Fats (g)</Label>
          <Input
            type="number"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
            required
            min="0"
            max="500"
            placeholder="70"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Next"}
      </Button>
    </form>
  );
}