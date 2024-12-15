import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FoodAnalysisSection } from "./FoodAnalysisSection";
import { UploadSection } from "./UploadSection";
import { LoadingSection } from "./LoadingSection";
import type { FoodAnalysis } from "@/services/openai";

interface AddFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMeal: (analysis: FoodAnalysis, imageUrl: string, quantity: number) => Promise<void>;
}

export function AddFoodDialog({ open, onOpenChange, onAddMeal }: AddFoodDialogProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const resetState = () => {
    setImageUrl("");
    setAnalysis(null);
    setQuantity(1);
    setIsLoading(false);
    setIsUploading(false);
  };

  const handleAddToMeals = async () => {
    if (!analysis) return;
    setIsLoading(true);
    try {
      await onAddMeal(analysis, imageUrl, quantity);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen);
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
          {!analysis && !isLoading && !isUploading && (
            <UploadSection
              onUploadStart={() => setIsUploading(true)}
              onUploadComplete={(url) => {
                setImageUrl(url);
                setIsUploading(false);
                setIsLoading(true);
              }}
              onAnalysisComplete={(result) => {
                setAnalysis(result);
                setIsLoading(false);
              }}
            />
          )}

          {(isLoading || isUploading) && <LoadingSection />}

          {analysis && imageUrl && !isLoading && !isUploading && (
            <FoodAnalysisSection
              analysis={analysis}
              imageUrl={imageUrl}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToMeals={handleAddToMeals}
              isLoading={isLoading}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}