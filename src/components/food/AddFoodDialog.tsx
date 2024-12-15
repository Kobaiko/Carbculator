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
import { X } from "lucide-react";

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
      <DialogContent className="fixed left-0 right-0 bottom-0 top-0 p-0 md:p-6 md:relative md:max-w-2xl md:max-h-[90vh] md:rounded-2xl overflow-hidden bg-gradient-to-b from-white/80 to-white/60 dark:from-black/80 dark:to-black/60 backdrop-blur-xl border border-white/20 dark:border-black/20 shadow-2xl">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20 backdrop-blur-sm transition-colors z-50"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="h-full flex flex-col overflow-hidden">
          <DialogHeader className="p-6 md:p-0">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Meal paparazzi time! 📸
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-8">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}