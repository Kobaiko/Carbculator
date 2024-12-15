import type { FoodAnalysis } from "@/services/openai";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileAddFoodDrawer } from "./MobileAddFoodDrawer";
import { DesktopAddFoodDialog } from "./DesktopAddFoodDialog";

interface AddFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMeal: (analysis: FoodAnalysis, imageUrl: string, quantity: number) => Promise<void>;
}

export function AddFoodDialog({ open, onOpenChange, onAddMeal }: AddFoodDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileAddFoodDrawer 
        open={open} 
        onOpenChange={onOpenChange}
        onAddMeal={onAddMeal}
      />
    );
  }

  return (
    <DesktopAddFoodDialog 
      open={open} 
      onOpenChange={onOpenChange}
      onAddMeal={onAddMeal}
    />
  );
}