import { useToast } from "@/hooks/use-toast";
import { FileInput } from "./FileInput";
import { processImage } from "./ImageProcessor";

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

  const handleFileUpload = async (file: File) => {
    try {
      onUploadStart();

      const { publicUrl, analysis } = await processImage(file);
      
      onUploadComplete(publicUrl);
      onAnalysisComplete(analysis);

    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return <FileInput onFileSelect={handleFileUpload} />;
}