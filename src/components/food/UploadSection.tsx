import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { analyzeFoodImage } from "@/services/openai";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";

interface UploadSectionProps {
  onUploadStart: () => void;
  onUploadComplete: (url: string) => void;
  onAnalysisComplete: (analysis: any) => void;
}

export function UploadSection({ 
  onUploadStart,
  onUploadComplete,
  onAnalysisComplete,
}: UploadSectionProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      onUploadStart();

      // Convert the file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result?.toString().split(",")[1];
        if (!base64Image) return;

        try {
          // Upload to Supabase Storage
          const fileName = `${Date.now()}-${file.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("food-images")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from("food-images")
            .getPublicUrl(fileName);

          onUploadComplete(publicUrl);

          // Analyze the image
          const mealAnalysis = await analyzeFoodImage(base64Image);
          onAnalysisComplete(mealAnalysis);
        } catch (error) {
          console.error("Error processing image:", error);
          toast({
            title: "Error",
            description: "Failed to process the image. Please try again.",
            variant: "destructive",
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-center text-muted-foreground">
        Upload a photo of your meal to get started
      </p>
      <div className="flex flex-col gap-4">
        {isMobile && (
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={() => document.getElementById("food-image")?.click()}
          >
            <Camera className="mr-2 h-4 w-4" />
            Take Photo
          </Button>
        )}
        
        {isMobile && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
        )}

        <Button
          variant={isMobile ? "outline" : "default"}
          size="lg"
          className="w-full"
          onClick={() => document.getElementById("food-image")?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
        <input
          type="file"
          id="food-image"
          accept="image/*"
          capture={isMobile ? "environment" : undefined}
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
}