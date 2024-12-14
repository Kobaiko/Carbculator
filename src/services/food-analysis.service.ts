import { openai, OPENAI_CONFIG } from '../config/openai';
import type { FoodAnalysisResponse } from '../types/food';

const ANALYSIS_PROMPT = `
This image was taken from approximately 1 foot (30 cm) away from the plate. 
Based on this consistent distance, analyze this food image and provide:

1) A brief description of the meal
2) Estimated macronutrients in this format:
   - calories (kcal)
   - protein (g)
   - fat (g)
   - carbohydrates (g)

Respond in JSON format with these keys: description, calories, protein, fat, carbs
`.trim();

export async function analyzeFoodImage(base64Image: string): Promise<FoodAnalysisResponse> {
  // Remove data URL prefix if present
  const base64Data = base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: ANALYSIS_PROMPT },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64Data}` }
            }
          ]
        }
      ],
      max_tokens: OPENAI_CONFIG.maxTokens,
      temperature: OPENAI_CONFIG.temperature
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response');
    }
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const result = JSON.parse(jsonMatch[0]);
    
    return {
      description: result.description,
      calories: Number(result.calories),
      protein: Number(result.protein),
      fat: Number(result.fat),
      carbs: Number(result.carbs)
    };
  } catch (error) {
    console.error('Error analyzing food image:', error);
    throw new Error('Failed to analyze food image');
  }
}