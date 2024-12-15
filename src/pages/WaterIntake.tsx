import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WaterGlass } from "@/components/water/WaterGlass";
import { WaterPortionButtons } from "@/components/water/WaterPortionButtons";
import { WaterEntries } from "@/components/water/WaterEntries";
import { useToast } from "@/hooks/use-toast";

export default function WaterIntake() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
  const waterGoal = profile?.daily_water ?? 2000; // Use nullish coalescing to only use default if value is null/undefined
  const progressPercentage = Math.min(100, Math.round((totalWater / waterGoal) * 100));

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
      queryClient.invalidateQueries({ queryKey: ["water-entries"] });
      toast({
        title: "Success",
        description: "Water entry added successfully",
      });
    },
    onError: (error) => {
      console.error("Error adding water entry:", error);
      toast({
        title: "Error",
        description: "Failed to add water entry",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl flex items-center justify-center">
            <WaterGlass percentage={progressPercentage} />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{progressPercentage}%</p>
            <p className="text-sm text-muted-foreground">
              {totalWater}ml / {waterGoal}ml
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-6 rounded-2xl">
            <WaterPortionButtons onAddWater={(amount) => addWaterMutation.mutate(amount)} />
          </div>
          {waterEntries && <WaterEntries entries={waterEntries} />}
        </div>
      </div>
    </div>
  );
}