import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface FileInputProps {
  onFileSelect: (file: File) => void;
}

export function FileInput({ onFileSelect }: FileInputProps) {
  const isMobile = useIsMobile();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-center text-muted-foreground">
        Upload a photo of your meal to get started
      </p>
      <div className="flex flex-col gap-4">
        {isMobile && (
          <>
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={() => document.getElementById("food-image")?.click()}
            >
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              For best results, take the photo from about 1 foot (30 cm) away from your plate
            </p>
          </>
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
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}