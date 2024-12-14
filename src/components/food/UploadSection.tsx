import { Upload, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UploadSectionProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  isMobile: boolean;
}

export function UploadSection({ onFileUpload, isLoading, isMobile }: UploadSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Upload Meal Image</h2>
      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-md p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-primary transition-colors">
          <Input
            id="food-image"
            type="file"
            accept="image/*"
            capture={isMobile ? "environment" : undefined}
            onChange={onFileUpload}
            disabled={isLoading}
            className="hidden"
          />
          <label
            htmlFor="food-image"
            className="flex flex-col items-center gap-4 cursor-pointer"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isMobile ? "Choose a file or take a photo" : "Choose a file"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                PNG, JPG up to 10MB
              </p>
            </div>
          </label>
        </div>

        {isMobile && (
          <Button
            onClick={() => {
              const input = document.getElementById("food-image") as HTMLInputElement;
              input?.click();
            }}
            variant="outline"
            className="w-full max-w-md"
          >
            <Camera className="h-4 w-4 mr-2" />
            Take Photo
          </Button>
        )}
      </div>
    </div>
  );
}