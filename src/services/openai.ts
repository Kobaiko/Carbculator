import { toast } from "@/components/ui/use-toast";

export interface FoodAnalysis {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  healthScore: number;
}

export async function analyzeFoodImage(base64Image: string): Promise<FoodAnalysis> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this food image and provide the following information in JSON format: name of the dish, calories, protein (g), carbs (g), fats (g), and a health score from 1-10. Format: {\"name\": string, \"calories\": number, \"protein\": number, \"carbs\": number, \"fats\": number, \"healthScore\": number}",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to analyze image");
    }

    const result = JSON.parse(data.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("Error analyzing food:", error);
    toast({
      title: "Error",
      description: "Failed to analyze the image. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
}