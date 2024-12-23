import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GoalsForm } from "@/components/daily-goals/GoalsForm";
import { LoadingState } from "@/components/daily-goals/LoadingState";
import { ErrorState } from "@/components/daily-goals/ErrorState";

interface NutritionGoalsStepProps {
  onBack: () => void;
  onNext: (data: {
    dailyCalories: number;
    dailyProtein: number;
    dailyCarbs: number;
    dailyFats: number;
  }) => void;
  isLoading?: boolean;
}

export function NutritionGoalsStep({ onBack, onNext, isLoading }: NutritionGoalsStepProps) {
  const { data: profile, isLoading: isLoadingProfile, error, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select("daily_calories, daily_protein, daily_carbs, daily_fats")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (error) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (isLoadingProfile || !profile) {
    return <LoadingState />;
  }

  const initialGoals = {
    dailyCalories: profile.daily_calories?.toString() || "2000",
    dailyProtein: profile.daily_protein?.toString() || "150",
    dailyCarbs: profile.daily_carbs?.toString() || "250",
    dailyFats: profile.daily_fats?.toString() || "70",
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Set Your Daily Goals 🎯</h1>
        <p className="text-muted-foreground">
          Let's establish your nutritional targets
        </p>
      </div>

      <GoalsForm
        initialGoals={initialGoals}
        onSubmit={onNext}
        onCancel={onBack}
        isLoading={isLoading}
      />
    </div>
  );
}