import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadSection } from "@/components/food/UploadSection";
import { LoadingSection } from "@/components/food/LoadingSection";
import { FoodCard } from "@/components/FoodCard";
import { analyzeFoodImage } from "@/services/openai";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface FirstMealStepProps {
  onBack: () => void;
  onComplete: () => void;
}

export function FirstMealStep({ onBack, onComplete }: FirstMealStepProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result?.toString().split(",")[1];
        if (!base64Image) return;

        try {
          const fileName = `${Date.now()}-${file.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("food-images")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from("food-images")
            .getPublicUrl(fileName);

          setImageUrl(publicUrl);

          const mealAnalysis = await analyzeFoodImage(base64Image);
          setAnalysis(mealAnalysis);

          toast({
            title: "Success!",
            description: "Meal analysis completed.",
          });
        } catch (error) {
          console.error("Error processing image:", error);
          toast({
            title: "Error",
            description: "Failed to process the image. Please try again.",
            variant: "destructive",
          });
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToMeals = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error: dbError } = await supabase
        .from("food_entries")
        .insert({
          name: analysis.name,
          ingredients: analysis.ingredients,
          calories: analysis.calories,
          protein: analysis.protein,
          carbs: analysis.carbs,
          fats: analysis.fats,
          health_score: analysis.healthScore,
          image_url: imageUrl,
          user_id: user.id,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success!",
        description: "Added your first meal!",
      });
      
      onComplete();
    } catch (error) {
      console.error("Error saving meal:", error);
      toast({
        title: "Error",
        description: "Failed to save meal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Add Your First Meal 📸</h1>
        <p className="text-muted-foreground">
          Let's track your first meal together
        </p>
      </div>

      {!analysis && !isLoading && (
        <UploadSection
          onFileUpload={handleFileUpload}
          isLoading={isLoading}
          isMobile={isMobile}
        />
      )}

      {isLoading && <LoadingSection />}

      {analysis && imageUrl && (
        <div className="space-y-6">
          <FoodCard
            analysis={analysis}
            quantity={quantity}
            onQuantityChange={setQuantity}
            imageUrl={imageUrl}
          />
          <div className="flex gap-4">
            <Button 
              variant="outline"
              className="flex-1"
              onClick={onBack}
              disabled={isLoading}
            >
              Back
            </Button>
            <Button 
              className="flex-1"
              onClick={handleAddToMeals}
              disabled={isLoading}
            >
              Complete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}