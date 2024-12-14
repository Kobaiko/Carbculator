import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Flame, Dumbbell, Wheat, Droplets } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MacroData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  healthScore: number;
}

const Index = () => {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [macros, setMacros] = useState<MacroData | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setImage(file);
    setLoading(true);
    
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result?.toString().split(',')[1];
        
        // Here we would make the API call to GPT-4V
        // For now, we'll simulate a response
        setTimeout(() => {
          setMacros({
            name: "Milkshake with Cake",
            calories: 1340,
            protein: 18,
            carbs: 166,
            fats: 64,
            healthScore: 3
          });
          setLoading(false);
        }, 1500);
      };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Implementation for camera capture would go here
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
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-secondary">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Calorie Tracker</h1>
          <p className="text-muted-foreground">
            Upload or take a photo of your food
          </p>
        </div>

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

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="mt-4 text-muted-foreground">Analyzing your food...</p>
            </div>
          )}

          {macros && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="text-center">
                <h2 className="text-2xl font-semibold">{macros.name}</h2>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  <Flame className="w-4 h-4 mr-2" />
                  {macros.calories} calories
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="macro-card text-center">
                  <Dumbbell className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                  <div className="text-lg font-semibold">{macros.protein}g</div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                </div>
                <div className="macro-card text-center">
                  <Wheat className="w-5 h-5 mx-auto mb-2 text-amber-500" />
                  <div className="text-lg font-semibold">{macros.carbs}g</div>
                  <div className="text-sm text-muted-foreground">Carbs</div>
                </div>
                <div className="macro-card text-center">
                  <Droplets className="w-5 h-5 mx-auto mb-2 text-green-500" />
                  <div className="text-lg font-semibold">{macros.fats}g</div>
                  <div className="text-sm text-muted-foreground">Fats</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Health Score</span>
                  <span className="text-sm text-muted-foreground">
                    {macros.healthScore}/10
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="health-score-bar"
                    style={{
                      width: `${(macros.healthScore / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;