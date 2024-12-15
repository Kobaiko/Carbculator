import { Button } from "@/components/ui/button";
import { FoodCard } from "../FoodCard";
import type { FoodAnalysis } from "@/services/openai";

interface FoodAnalysisSectionProps {
  analysis: FoodAnalysis;
  imageUrl: string;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToMeals: () => void;
  isLoading: boolean;
}

export function FoodAnalysisSection({
  analysis,
  imageUrl,
  quantity,
  onQuantityChange,
  onAddToMeals,
  isLoading,
}: FoodAnalysisSectionProps) {
  return (
    <div className="space-y-6">
      <FoodCard
        analysis={analysis}
        quantity={quantity}
        onQuantityChange={onQuantityChange}
        imageUrl={imageUrl}
      />
      <Button 
        className="w-full"
        size="lg"
        onClick={onAddToMeals}
        disabled={isLoading}
      >
        Add to Daily Meals
      </Button>
    </div>
  );
}