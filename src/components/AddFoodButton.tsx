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

          // Save to database
          const { error: dbError } = await supabase
            .from("food_entries")
            .insert({
              name: foodAnalysis.name,
              ingredients: foodAnalysis.ingredients,
              calories: foodAnalysis.calories,
              protein: foodAnalysis.protein,
              carbs: foodAnalysis.carbs,
              fats: foodAnalysis.fats,
              health_score: foodAnalysis.healthScore,
              image_url: publicUrl,
            });

          if (dbError) throw dbError;

          toast({
            title: "Success!",
            description: "Food analysis completed and saved.",
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
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto glass-card border-none">
          <DialogHeader className="relative">
            <DialogTitle>Add Food Entry</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="food-image" className="text-sm font-medium">
                {isMobile ? "Take a Photo" : "Upload Food Image"}
              </label>
              <div className="flex gap-2">
                <Input
                  id="food-image"
                  type="file"
                  accept="image/*"
                  capture={isMobile ? "environment" : undefined}
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
            </div>

            {isLoading && (
              <div className="text-center py-8 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground animate-pulse">
                  AI is analyzing your food...
                </p>
              </div>
            )}

            {analysis && imageUrl && (
              <FoodCard
                analysis={analysis}
                quantity={quantity}
                onQuantityChange={setQuantity}
                imageUrl={imageUrl}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}