import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { base64Image } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    // Step 1: Get ingredients from the image
    console.log('Getting ingredients from image...');
    const ingredientsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'List all ingredients you can see in this food image. Format your response as a comma-separated list.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    if (!ingredientsResponse.ok) {
      const errorData = await ingredientsResponse.json();
      console.error('OpenAI API error (ingredients):', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const ingredientsData = await ingredientsResponse.json();
    console.log('Ingredients API response:', JSON.stringify(ingredientsData, null, 2));

    if (!ingredientsData.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response format (ingredients):', ingredientsData);
      throw new Error('Invalid response format from OpenAI (ingredients)');
    }

    const ingredients = ingredientsData.choices[0].message.content.trim();
    console.log('Identified ingredients:', ingredients);

    // Step 2: Get nutritional information based on ingredients
    console.log('Calculating nutritional information...');
    const nutritionPrompt = `Based on these ingredients: ${ingredients}

    Provide nutritional information in this exact JSON format:
    {
      "name": "Name of the dish",
      "ingredients": ["ingredient1", "ingredient2"],
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fats": 0,
      "healthScore": 0
    }
    
    Be precise with the numbers and realistic with the health score (1-10). Return ONLY the JSON object, no additional text.`;

    const nutritionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: nutritionPrompt
          },
        ],
        max_tokens: 1000,
      }),
    });

    if (!nutritionResponse.ok) {
      const errorData = await nutritionResponse.json();
      console.error('OpenAI API error (nutrition):', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const nutritionData = await nutritionResponse.json();
    console.log('Nutrition API response:', JSON.stringify(nutritionData, null, 2));

    if (!nutritionData.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response format (nutrition):', nutritionData);
      throw new Error('Invalid response format from OpenAI (nutrition)');
    }

    try {
      const content = nutritionData.choices[0].message.content.trim();
      console.log('Raw nutrition content:', content);
      
      // Try to find JSON object in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON object found in response');
        throw new Error('No JSON object found in response');
      }
      
      const result = JSON.parse(jsonMatch[0]);
      console.log('Parsed nutrition result:', result);
      
      // Validate the parsed result has all required fields
      const requiredFields = ['name', 'ingredients', 'calories', 'protein', 'carbs', 'fats', 'healthScore'];
      for (const field of requiredFields) {
        if (!(field in result)) {
          console.error(`Missing required field: ${field} in result:`, result);
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Ensure ingredients is an array
      if (typeof result.ingredients === 'string') {
        result.ingredients = result.ingredients.split(',').map((i: string) => i.trim());
      }

      // Convert numeric fields
      result.calories = Number(result.calories);
      result.protein = Number(result.protein);
      result.carbs = Number(result.carbs);
      result.fats = Number(result.fats);
      result.healthScore = Number(result.healthScore);

      // Validate numeric fields
      const numericFields = ['calories', 'protein', 'carbs', 'fats', 'healthScore'];
      for (const field of numericFields) {
        if (isNaN(result[field])) {
          console.error(`Invalid numeric value for ${field}:`, result[field]);
          throw new Error(`Invalid numeric value for ${field}`);
        }
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw content:', nutritionData.choices[0].message.content);
      throw new Error(`Failed to parse OpenAI response: ${parseError.message}`);
    }
  } catch (error) {
    console.error('Error in analyze-food function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : undefined
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});