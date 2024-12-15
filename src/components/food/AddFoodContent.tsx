import { useState } from "react";
import type { FoodAnalysis } from "@/services/openai";
import { FoodAnalysisSection } from "./FoodAnalysisSection";
import { UploadSection } from "./UploadSection";
import { LoadingSection } from "./LoadingSection";

interface AddFoodContentProps {
  onOpenChange: (open: boolean) => void;
  onAddMeal: (analysis: FoodAnalysis, imageUrl: string, quantity: number) => Promise<void>;
  renderHeader: (showHeader: boolean) => React.ReactNode;
  renderContent: (content: React.ReactNode) => React.ReactNode;
}

export function AddFoodContent({ 
  onOpenChange, 
  onAddMeal,
  renderHeader,
  renderContent,
}: AddFoodContentProps) {
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

  const content = (
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

  return (
    <>
      {renderHeader(!analysis && !isLoading && !isUploading)}
      {renderContent(content)}
    </>
  );
}