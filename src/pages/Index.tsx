import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FoodCard } from "@/components/FoodCard";
import { analyzeFoodImage, type FoodAnalysis } from "@/services/openai";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setImage(URL.createObjectURL(file));
    setLoading(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result?.toString().split(',')[1];
        if (base64Image) {
          const result = await analyzeFoodImage(base64Image);
          setAnalysis(result);
        }
      };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      toast({
        title: "Camera Access",
        description: "Camera functionality coming soon!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-b from-background to-secondary">
      <Navigation />
      <div className="max-w-md mx-auto space-y-6 pt-16 md:ml-16">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Calorie Tracker</h1>
          <p className="text-muted-foreground">
            Upload or take a photo of your food
          </p>
        </div>

        {!image && (
          <Card className="p-6 glass-card space-y-6">
            <div className="flex gap-4">
              <Button
                className="flex-1 h-16"
                variant="outline"
                onClick={handleCapture}
              >
                <Camera className="mr-2 h-5 w-5" />
                Take Photo
              </Button>
              <Button
                className="flex-1 h-16"
                variant="outline"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) handleImageUpload(file);
                  };
                  input.click();
                }}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload
              </Button>
            </div>
          </Card>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Analyzing your food...</p>
          </div>
        )}

        {image && analysis && (
          <FoodCard
            analysis={analysis}
            quantity={quantity}
            onQuantityChange={setQuantity}
            imageUrl={image}
          />
        )}
      </div>
    </div>
  );
}

export default Index;