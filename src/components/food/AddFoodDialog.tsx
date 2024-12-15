import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FoodAnalysisSection } from "./FoodAnalysisSection";
import { UploadSection } from "./UploadSection";
import { LoadingSection } from "./LoadingSection";
import type { FoodAnalysis } from "@/services/openai";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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

  const dialogContent = (
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
  );

  if (isMobile) {
    return (
      <Drawer 
        open={open} 
        onOpenChange={(newOpen) => {
          onOpenChange(newOpen);
          if (!newOpen) {
            resetState();
          }
        }}
      >
        <DrawerContent className="bg-white text-black px-4 pb-8 fixed bottom-0 left-0 right-0 max-h-[95vh] rounded-t-[20px]">
          <div 
            className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 my-4 cursor-pointer" 
            onClick={() => onOpenChange(false)}
          />
          {(!analysis && !isLoading && !isUploading) && (
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-2xl font-bold text-center">
                Meal paparazzi time! 📸
              </DrawerTitle>
            </DrawerHeader>
          )}
          <ScrollArea className="h-[calc(95vh-100px)] overflow-y-auto px-1">
            {dialogContent}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Meal paparazzi time! 📸
          </DialogTitle>
        </DialogHeader>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}