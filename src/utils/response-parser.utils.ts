import type { ChatCompletion } from 'openai/resources';
import type { FoodAnalysisResponse } from '../types/food';

export function parseAnalysisResponse(response: ChatCompletion): FoodAnalysisResponse {
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
}