import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FoodAnalysis } from "@/services/openai";
import { DrawerHandle } from "./DrawerHandle";
import { AddFoodContent } from "./AddFoodContent";

interface MobileAddFoodDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMeal: (analysis: FoodAnalysis, imageUrl: string, quantity: number) => Promise<void>;
}

export function MobileAddFoodDrawer({ 
  open, 
  onOpenChange, 
  onAddMeal 
}: MobileAddFoodDrawerProps) {
  return (
    <Drawer 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DrawerContent className="bg-white text-black px-4 pb-8 fixed bottom-0 left-0 right-0 max-h-[95vh] rounded-t-[20px]">
        <DrawerHandle onClose={() => onOpenChange(false)} />
        <AddFoodContent 
          onOpenChange={onOpenChange}
          onAddMeal={onAddMeal}
          renderHeader={(showHeader) => showHeader && (
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-2xl font-bold text-center">
                Meal paparazzi time! 📸
              </DrawerTitle>
            </DrawerHeader>
          )}
          renderContent={(content) => (
            <ScrollArea className="h-[calc(95vh-100px)] overflow-y-auto px-1">
              {content}
            </ScrollArea>
          )}
        />
      </DrawerContent>
    </Drawer>
  );
}