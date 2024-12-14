import { Plus, Upload, Camera, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FoodCard } from "./FoodCard";
import { analyzeFoodImage } from "@/services/openai";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

export function AddFoodButton() {
  const [open, setOpen] = useState(false);
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
          const foodAnalysis = await analyzeFoodImage(base64Image);
          setAnalysis(foodAnalysis);

          toast({
            title: "Success!",
            description: "Food analysis completed.",
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card">
          <DialogHeader className="relative mb-6">
            <DialogTitle className="text-2xl font-bold">Add Food Entry</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="space-y-8">
            {!analysis && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Upload Food Image</h2>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full max-w-md p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-primary transition-colors">
                    <Input
                      id="food-image"
                      type="file"
                      accept="image/*"
                      capture={isMobile ? "environment" : undefined}
                      onChange={handleFileUpload}
                      disabled={isLoading}
                      className="hidden"
                    />
                    <label
                      htmlFor="food-image"
                      className="flex flex-col items-center gap-4 cursor-pointer"
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isMobile ? "Choose a file or take a photo" : "Choose a file"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    </label>
                  </div>

                  {isMobile && (
                    <Button
                      onClick={() => {
                        const input = document.getElementById("food-image") as HTMLInputElement;
                        input?.click();
                      }}
                      variant="outline"
                      className="w-full max-w-md"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                  )}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-12 space-y-4">
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
                </div>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                  AI is analyzing your food...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  This might take a few seconds
                </p>
              </div>
            )}

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