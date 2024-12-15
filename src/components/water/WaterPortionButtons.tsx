import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassWater } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WaterPortionButtonsProps {
  onAddWater: (amount: number) => void;
}

export function WaterPortionButtons({ onAddWater }: WaterPortionButtonsProps) {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");

  const defaultPortions = [
    { label: "Small", amount: 200 },
    { label: "Medium", amount: 350 },
    { label: "Large", amount: 500 },
  ];

  const handleCustomSubmit = () => {
    const amount = parseInt(customAmount);
    if (!isNaN(amount) && amount > 0) {
      onAddWater(amount);
      setIsCustomOpen(false);
      setCustomAmount("");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {defaultPortions.map((portion) => (
        <Button
          key={portion.label}
          onClick={() => onAddWater(portion.amount)}
          variant="outline"
          className="glass-card hover:bg-accent h-16 text-lg flex items-center justify-start px-6"
        >
          <GlassWater className="h-6 w-6 mr-4" />
          <div className="flex flex-col items-start">
            <span className="text-lg font-semibold">{portion.label}</span>
            <span className="text-sm text-muted-foreground">
              ({portion.amount}ml)
            </span>
          </div>
        </Button>
      ))}

      <Dialog open={isCustomOpen} onOpenChange={setIsCustomOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="glass-card hover:bg-accent h-16 text-lg flex items-center justify-start px-6"
          >
            <GlassWater className="h-6 w-6 mr-4" />
            <div className="flex flex-col items-start">
              <span className="text-lg font-semibold">Custom</span>
              <span className="text-sm text-muted-foreground">
                (Enter amount)
              </span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Amount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Enter amount in ml"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
              <span className="text-sm text-muted-foreground">ml</span>
            </div>
            <Button onClick={handleCustomSubmit} className="w-full">
              Add Water
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}