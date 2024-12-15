import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FoodAnalysis } from "@/services/openai";
import { AddFoodContent } from "./AddFoodContent";

interface DesktopAddFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMeal: (analysis: FoodAnalysis, imageUrl: string, quantity: number) => Promise<void>;
}

export function DesktopAddFoodDialog({ 
  open, 
  onOpenChange, 
  onAddMeal 
}: DesktopAddFoodDialogProps) {
  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AddFoodContent 
          onOpenChange={onOpenChange}
          onAddMeal={onAddMeal}
          renderHeader={(showHeader) => showHeader && (
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Meal paparazzi time! 📸
              </DialogTitle>
            </DialogHeader>
          )}
          renderContent={(content) => content}
        />
      </DialogContent>
    </Dialog>
  );
}