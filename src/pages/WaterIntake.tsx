import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GlassWater, Droplets, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { WaterGlass } from "@/components/water/WaterGlass";
import { WaterPortionButtons } from "@/components/water/WaterPortionButtons";

export default function WaterIntake() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's daily water goal
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch today's water entries
  const { data: waterEntries } = useQuery({
    queryKey: ["waterEntries", "today"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("water_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", today.toISOString())
        .lt("created_at", new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;
      return data;
    },
  });

  // Calculate total water intake for today
  const totalWater = waterEntries?.reduce((sum, entry) => sum + entry.amount, 0) || 0;
  const waterGoal = profile?.daily_water || 2000;
  const progressPercentage = Math.min(Math.round((totalWater / waterGoal) * 100), 100);

  // Add water entry mutation
  const addWaterMutation = useMutation({
    mutationFn: async (amount: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("water_entries")
        .insert([{ user_id: user.id, amount }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waterEntries"] });
      toast({
        title: "Water intake added!",
        description: "Keep up the good work! 💧",
      });
    },
  });

  // Update water goal mutation
  const updateGoalMutation = useMutation({
    mutationFn: async (newGoal: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update({ daily_water: newGoal })
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsSettingsOpen(false);
      toast({
        title: "Daily water goal updated!",
        description: "Your new goal has been set. 🎯",
      });
    },
  });

  const handleUpdateGoal = () => {
    const goal = parseInt(newGoal);
    if (isNaN(goal) || goal <= 0) {
      toast({
        title: "Invalid goal",
        description: "Please enter a valid number greater than 0.",
        variant: "destructive",
      });
      return;
    }
    updateGoalMutation.mutate(goal);
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Water Intake</h1>
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Daily Water Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Enter goal in ml"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                />
                <span className="text-sm text-muted-foreground">ml</span>
              </div>
              <Button onClick={handleUpdateGoal} className="w-full">
                Save Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <WaterGlass percentage={progressPercentage} />
        <div className="text-center mt-4">
          <p className="text-2xl font-bold">{progressPercentage}%</p>
          <p className="text-sm text-muted-foreground">
            {totalWater}ml / {waterGoal}ml
          </p>
        </div>
      </div>

      <WaterPortionButtons onAddWater={(amount) => addWaterMutation.mutate(amount)} />
    </div>
  );
}