import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FoodCard } from "./FoodCard";
import { analyzeFoodImage } from "@/services/openai";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { UploadSection } from "./food/UploadSection";
import { LoadingSection } from "./food/LoadingSection";

export function AddFoodButton() {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const resetState = () => {
    setImageUrl("");
    setAnalysis(null);
    setQuantity(1);
    setIsLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);

      // Convert the file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result?.toString().split(",")[1];
        if (!base64Image) return;

        try {
          // Upload to Supabase Storage
          const fileName = `${Date.now()}-${file.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("food-images")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from("food-images")
            .getPublicUrl(fileName);

          setImageUrl(publicUrl);

          // Analyze the image
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
      
      // Save to database
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
        });

      if (dbError) throw dbError;

      toast({
        title: "Success!",
        description: "Added to your daily meals.",
      });
      
      setOpen(false);
    } catch (error) {
      console.error("Error saving to meals:", error);
      toast({
        title: "Error",
        description: "Failed to add to daily meals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <Dialog 
        open={open} 
        onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (!newOpen) {
            resetState();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Meal paparazzi time! 📸</DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
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
                <Button 
                  className="w-full"
                  size="lg"
                  onClick={handleAddToMeals}
                  disabled={isLoading}
                >
                  Add to Daily Meals
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}