import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { GlassWater, Dumbbell, Flame, Wheat, Droplets } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DailyGoals() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoals, setEditedGoals] = useState({
    dailyCalories: 0,
    dailyProtein: 0,
    dailyCarbs: 0,
    dailyFats: 0,
  });

  // Fetch user profile data
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

  // Fetch today's meals
  const { data: todaysMeals } = useQuery({
    queryKey: ["todaysMeals"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("food_entries")
        .select("*")
        .gte("created_at", today.toISOString())
        .lt("created_at", new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;
      return data;
    },
  });

  // Calculate current progress from today's meals
  const progress = {
    calories: todaysMeals?.reduce((sum, meal) => sum + meal.calories, 0) || 0,
    protein: todaysMeals?.reduce((sum, meal) => sum + Number(meal.protein), 0) || 0,
    carbs: todaysMeals?.reduce((sum, meal) => sum + Number(meal.carbs), 0) || 0,
    fats: todaysMeals?.reduce((sum, meal) => sum + Number(meal.fats), 0) || 0,
    water: 1500, // Mock data for now
  };

  const handleEditClick = () => {
    if (profile) {
      setIsEditing(true);
      setEditedGoals({
        dailyCalories: profile.daily_calories,
        dailyProtein: profile.daily_protein,
        dailyCarbs: profile.daily_carbs,
        dailyFats: profile.daily_fats,
      });
    }
  };

  const handleSaveGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update({
          daily_calories: editedGoals.dailyCalories,
          daily_protein: editedGoals.dailyProtein,
          daily_carbs: editedGoals.dailyCarbs,
          daily_fats: editedGoals.dailyFats,
        })
        .eq("id", user.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Your daily goals have been updated.",
      });
    } catch (error) {
      console.error("Error saving goals:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update your goals. Please try again.",
      });
    }
  };

  const calculateProgress = (current: number, target: number) => {
    if (!target) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background pb-16">
      <Navigation />
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-6 pt-8 md:pt-12 md:ml-20">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Daily Goals</h1>
          <p className="text-muted-foreground">Track your daily nutrition progress</p>
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
                  <p className="text-sm text-muted-foreground">Daily Target: {profile?.daily_calories} kcal</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current</div>
                <span className="text-2xl font-bold">{progress.calories} kcal</span>
              </div>
            </div>
            <Progress value={calculateProgress(progress.calories, profile?.daily_calories || 0)} className="h-2" />
            {isEditing && (
              <Input
                type="number"
                value={editedGoals.dailyCalories}
                onChange={(e) => setEditedGoals(prev => ({ ...prev, dailyCalories: parseInt(e.target.value) }))}
                className="mt-2"
              />
            )}
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
                  <p className="text-sm text-muted-foreground">Daily Target: {profile?.daily_protein}g</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current</div>
                <span className="text-2xl font-bold">{progress.protein}g</span>
              </div>
            </div>
            <Progress value={calculateProgress(progress.protein, profile?.daily_protein || 0)} className="h-2" />
            {isEditing && (
              <Input
                type="number"
                value={editedGoals.dailyProtein}
                onChange={(e) => setEditedGoals(prev => ({ ...prev, dailyProtein: parseInt(e.target.value) }))}
                className="mt-2"
              />
            )}
          </div>

          {/* Carbs Card */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-full">
                  <Wheat className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Carbs</h3>
                  <p className="text-sm text-muted-foreground">Daily Target: {profile?.daily_carbs}g</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current</div>
                <span className="text-2xl font-bold">{progress.carbs}g</span>
              </div>
            </div>
            <Progress value={calculateProgress(progress.carbs, profile?.daily_carbs || 0)} className="h-2" />
            {isEditing && (
              <Input
                type="number"
                value={editedGoals.dailyCarbs}
                onChange={(e) => setEditedGoals(prev => ({ ...prev, dailyCarbs: parseInt(e.target.value) }))}
                className="mt-2"
              />
            )}
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
                  <p className="text-sm text-muted-foreground">Daily Target: {profile?.daily_fats}g</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current</div>
                <span className="text-2xl font-bold">{progress.fats}g</span>
              </div>
            </div>
            <Progress value={calculateProgress(progress.fats, profile?.daily_fats || 0)} className="h-2" />
            {isEditing && (
              <Input
                type="number"
                value={editedGoals.dailyFats}
                onChange={(e) => setEditedGoals(prev => ({ ...prev, dailyFats: parseInt(e.target.value) }))}
                className="mt-2"
              />
            )}
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

        <div className="flex justify-center mt-8">
          {!isEditing ? (
            <Button onClick={handleEditClick}>Edit Goals</Button>
          ) : (
            <div className="space-x-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSaveGoals}>Save Goals</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}