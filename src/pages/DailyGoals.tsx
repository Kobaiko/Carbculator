import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { GlassWater, Dumbbell, Flame, Droplets } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function DailyGoals() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoals, setEditedGoals] = useState({
    daily_calories: 0,
    daily_protein: 0,
    daily_carbs: 0,
    daily_fats: 0,
  });

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

  const updateGoals = useMutation({
    mutationFn: async (newGoals: typeof editedGoals) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update(newGoals)
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsEditing(false);
      toast({
        title: "Goals updated",
        description: "Your daily nutrition goals have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update goals. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mock progress data (to be implemented later)
  const progress = {
    calories: 1200,
    protein: 75,
    carbs: 120,
    fats: 35,
    water: 1500, // in ml
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const handleEditClick = () => {
    setEditedGoals({
      daily_calories: profile?.daily_calories || 0,
      daily_protein: profile?.daily_protein || 0,
      daily_carbs: profile?.daily_carbs || 0,
      daily_fats: profile?.daily_fats || 0,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateGoals.mutate(editedGoals);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background pb-16">
      <Navigation />
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-6 pt-8 md:pt-12 md:ml-20">
        <div className="flex justify-between items-center">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Daily Goals</h1>
            <p className="text-muted-foreground">Track your daily nutrition progress</p>
          </div>
          {!isEditing ? (
            <Button onClick={handleEditClick} variant="outline">Edit Goals</Button>
          ) : (
            <div className="space-x-2">
              <Button onClick={() => setIsEditing(false)} variant="outline">Cancel</Button>
              <Button onClick={handleSave}>Save Goals</Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calories Card */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-full">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Calories</h3>
                  <p className="text-sm text-muted-foreground">
                    Daily Target: {profile?.daily_calories} kcal
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current</div>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedGoals.daily_calories}
                    onChange={(e) => setEditedGoals(prev => ({
                      ...prev,
                      daily_calories: parseInt(e.target.value) || 0
                    }))}
                    className="w-24 text-right"
                  />
                ) : (
                  <span className="text-2xl font-bold">{progress.calories} kcal</span>
                )}
              </div>
            </div>
            <Progress value={calculateProgress(progress.calories, profile?.daily_calories || 2000)} className="h-2" />
          </div>

          {/* Protein Card */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <Dumbbell className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Protein</h3>
                  <p className="text-sm text-muted-foreground">
                    Daily Target: {profile?.daily_protein}g
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current</div>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedGoals.daily_protein}
                    onChange={(e) => setEditedGoals(prev => ({
                      ...prev,
                      daily_protein: parseInt(e.target.value) || 0
                    }))}
                    className="w-24 text-right"
                  />
                ) : (
                  <span className="text-2xl font-bold">{progress.protein}g</span>
                )}
              </div>
            </div>
            <Progress value={calculateProgress(progress.protein, profile?.daily_protein || 150)} className="h-2" />
          </div>

          {/* Carbs Card */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-full">
                  <Droplets className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Carbs</h3>
                  <p className="text-sm text-muted-foreground">
                    Daily Target: {profile?.daily_carbs}g
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current</div>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedGoals.daily_carbs}
                    onChange={(e) => setEditedGoals(prev => ({
                      ...prev,
                      daily_carbs: parseInt(e.target.value) || 0
                    }))}
                    className="w-24 text-right"
                  />
                ) : (
                  <span className="text-2xl font-bold">{progress.carbs}g</span>
                )}
              </div>
            </div>
            <Progress value={calculateProgress(progress.carbs, profile?.daily_carbs || 250)} className="h-2" />
          </div>

          {/* Fats Card */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-full">
                  <Droplets className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Fats</h3>
                  <p className="text-sm text-muted-foreground">
                    Daily Target: {profile?.daily_fats}g
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current</div>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedGoals.daily_fats}
                    onChange={(e) => setEditedGoals(prev => ({
                      ...prev,
                      daily_fats: parseInt(e.target.value) || 0
                    }))}
                    className="w-24 text-right"
                  />
                ) : (
                  <span className="text-2xl font-bold">{progress.fats}g</span>
                )}
              </div>
            </div>
            <Progress value={calculateProgress(progress.fats, profile?.daily_fats || 70)} className="h-2" />
          </div>

          {/* Water Intake Card - Full Width */}
          <div className="glass-card p-6 rounded-2xl space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <GlassWater className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Water Intake</h3>
                  <p className="text-sm text-muted-foreground">Daily Target: 2000ml</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current</div>
                <span className="text-2xl font-bold">{progress.water}ml</span>
              </div>
            </div>
            <Progress value={calculateProgress(progress.water, 2000)} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
}