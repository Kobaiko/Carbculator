import { analyzeFoodImage } from "@/services/openai";
import { supabase } from "@/integrations/supabase/client";

export async function processImage(file: File): Promise<{ publicUrl: string; analysis: any }> {
  // Convert file to base64
  const base64Image = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result?.toString().split(",")[1];
      if (base64) resolve(base64);
    };
    reader.readAsDataURL(file);
  });

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

  // Analyze the image
  const analysis = await analyzeFoodImage(base64Image);

  return { publicUrl, analysis };
}