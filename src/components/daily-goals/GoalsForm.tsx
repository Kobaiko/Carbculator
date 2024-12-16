import { useState } from "react";
import { GoalInput } from "./GoalInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface GoalsFormProps {
  initialGoals: {
    dailyCalories: string;
    dailyProtein: string;
    dailyCarbs: string;
    dailyFats: string;
  };
  onSubmit: (goals: {
    dailyCalories: number;
    dailyProtein: number;
    dailyCarbs: number;
    dailyFats: number;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function GoalsForm({ initialGoals, onSubmit, onCancel, isLoading }: GoalsFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialGoals);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert form data to numbers and validate
      const goals = {
        dailyCalories: parseInt(formData.dailyCalories),
        dailyProtein: parseInt(formData.dailyProtein),
        dailyCarbs: parseInt(formData.dailyCarbs),
        dailyFats: parseInt(formData.dailyFats),
      };

      // Validate numbers
      for (const [key, value] of Object.entries(goals)) {
        if (isNaN(value) || value <= 0) {
          toast({
            variant: "destructive",
            title: "Invalid Input",
            description: `Please enter a valid number for ${key.replace('daily', '')}`,
          });
          return;
        }
      }

      onSubmit(goals);
    } catch (error) {
      console.error("Error submitting goals:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save goals. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <GoalInput
          label="Daily Calories"
          value={formData.dailyCalories}
          onChange={(value) => handleChange("dailyCalories", value)}
          unit="kcal"
        />

        <GoalInput
          label="Daily Protein"
          value={formData.dailyProtein}
          onChange={(value) => handleChange("dailyProtein", value)}
          unit="g"
        />

        <GoalInput
          label="Daily Carbs"
          value={formData.dailyCarbs}
          onChange={(value) => handleChange("dailyCarbs", value)}
          unit="g"
        />

        <GoalInput
          label="Daily Fats"
          value={formData.dailyFats}
          onChange={(value) => handleChange("dailyFats", value)}
          unit="g"
        />
      </div>

      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className="flex-1"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button 
          type="submit" 
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Goals"}
        </Button>
      </div>
    </form>
  );
}