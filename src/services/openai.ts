import OpenAI from 'openai';

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  throw new Error('VITE_OPENAI_API_KEY environment variable is not set');
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeFood(imageBase64: string): Promise<{
  description: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}> {
  const base64Image = imageBase64.split(',')[1];

  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "This image was taken from approximately 1 foot (30 cm) away from the plate. Based on this consistent distance, analyze this food image and provide: 1) A brief description of the meal, and 2) Estimated macronutrients in this format: calories (kcal), protein (g), fat (g), carbohydrates (g). Respond in JSON format with these keys: description, calories, protein, fat, carbs"
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }
    ],
    max_tokens: 500,
    temperature: 0.5
  });

  try {
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
    console.error('Error parsing OpenAI response:', error);
    throw new Error('Failed to analyze food image');
  }
}