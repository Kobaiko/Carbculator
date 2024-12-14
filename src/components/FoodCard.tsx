import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Dumbbell, Wheat, Droplets, Plus, Minus } from "lucide-react";
import type { FoodAnalysis } from "@/services/openai";

interface FoodCardProps {
  analysis: FoodAnalysis;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  imageUrl: string;
}

export function FoodCard({ analysis, quantity, onQuantityChange, imageUrl }: FoodCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden animate-in fade-in-50">
      <div className="relative aspect-video">
        <img
          src={imageUrl}
          alt={analysis.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{analysis.name}</h2>
          <div className="flex items-center gap-2 bg-secondary rounded-full p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onQuantityChange(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Flame className="h-6 w-6 text-primary" />
            <span>{analysis.calories * quantity}</span>
            <span className="text-sm font-normal text-muted-foreground">calories</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="macro-card text-center">
            <Dumbbell className="w-5 h-5 mx-auto mb-2 text-blue-500" />
            <div className="text-lg font-semibold">{analysis.protein * quantity}g</div>
            <div className="text-sm text-muted-foreground">Protein</div>
          </div>
          <div className="macro-card text-center">
            <Wheat className="w-5 h-5 mx-auto mb-2 text-amber-500" />
            <div className="text-lg font-semibold">{analysis.carbs * quantity}g</div>
            <div className="text-sm text-muted-foreground">Carbs</div>
          </div>
          <div className="macro-card text-center">
            <Droplets className="w-5 h-5 mx-auto mb-2 text-green-500" />
            <div className="text-lg font-semibold">{analysis.fats * quantity}g</div>
            <div className="text-sm text-muted-foreground">Fats</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Health Score</span>
            <span className="text-sm text-muted-foreground">
              {analysis.healthScore}/10
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="health-score-bar"
              style={{
                width: `${(analysis.healthScore / 10) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}