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
        model: 'gpt-4o',
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
      throw new Error(errorData.error?.message || 'Failed to analyze ingredients');
    }

    const ingredientsData = await ingredientsResponse.json();
    if (!ingredientsData.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response format (ingredients):', ingredientsData);
      throw new Error('Invalid response format from OpenAI (ingredients)');
    }

    const ingredients = ingredientsData.choices[0].message.content.trim();
    console.log('Identified ingredients:', ingredients);

    // Step 2: Get nutritional information based on ingredients
    console.log('Calculating nutritional information...');
    const nutritionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `Based on these ingredients: ${ingredients}

            Provide nutritional information in this exact JSON format:
            {
              "name": "Name of the dish",
              "ingredients": ["ingredient1", "ingredient2", ...],
              "calories": number,
              "protein": number (in grams),
              "carbs": number (in grams),
              "fats": number (in grams),
              "healthScore": number (1-10)
            }
            
            Be precise with the numbers and realistic with the health score.`,
          },
        ],
        max_tokens: 1000,
      }),
    });

    if (!nutritionResponse.ok) {
      const errorData = await nutritionResponse.json();
      console.error('OpenAI API error (nutrition):', errorData);
      throw new Error(errorData.error?.message || 'Failed to calculate nutrition');
    }

    const nutritionData = await nutritionResponse.json();
    console.log('Nutrition response:', nutritionData);

    if (!nutritionData.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response format (nutrition):', nutritionData);
      throw new Error('Invalid response format from OpenAI (nutrition)');
    }

    try {
      const result = JSON.parse(nutritionData.choices[0].message.content);
      
      // Validate the parsed result has all required fields
      const requiredFields = ['name', 'ingredients', 'calories', 'protein', 'carbs', 'fats', 'healthScore'];
      for (const field of requiredFields) {
        if (!(field in result)) {
          console.error(`Missing required field: ${field} in result:`, result);
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Convert ingredients string array to actual array if needed
      if (typeof result.ingredients === 'string') {
        result.ingredients = result.ingredients.split(',').map(i => i.trim());
      }

      // Ensure all numeric fields are numbers
      result.calories = Number(result.calories);
      result.protein = Number(result.protein);
      result.carbs = Number(result.carbs);
      result.fats = Number(result.fats);
      result.healthScore = Number(result.healthScore);

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw content:', nutritionData.choices[0].message.content);
      throw new Error('Failed to parse OpenAI response');
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