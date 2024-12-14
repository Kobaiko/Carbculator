import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface FoodAnalysis {
  name: string;
  ingredients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  healthScore: number;
}

export async function analyzeFoodImage(base64Image: string): Promise<FoodAnalysis> {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-food', {
      body: { base64Image },
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error analyzing food:', error);
    toast({
      title: "Error",
      description: "Failed to analyze the image. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
}