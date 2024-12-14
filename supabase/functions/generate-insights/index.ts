import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId } = await req.json();

    // Fetch user's data
    const { data: measurements } = await supabase
      .from('measurements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    const { data: nutritionLogs } = await supabase
      .from('nutrition_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    const { data: waterLogs } = await supabase
      .from('water_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    // Prepare data summary for OpenAI
    const dataSummary = {
      measurements: measurements || [],
      nutrition: nutritionLogs || [],
      water: waterLogs || [],
    };

    // Generate insights using OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a health and nutrition expert. Analyze the provided data and give three types of insights:
            1. Trends: Analyze patterns in weight, nutrition, and water intake
            2. Recommendations: Provide actionable advice based on the data
            3. Goals: Suggest realistic goals based on current progress
            Keep each section concise and focused.`
          },
          {
            role: 'user',
            content: `Please analyze this health data and provide insights: ${JSON.stringify(dataSummary)}`
          }
        ],
      }),
    });

    const aiData = await openAIResponse.json();
    const insights = {
      trends: aiData.choices[0].message.content.split('\n\n')[0],
      recommendations: aiData.choices[0].message.content.split('\n\n')[1],
      goals: aiData.choices[0].message.content.split('\n\n')[2],
    };

    return new Response(JSON.stringify({ insights, data: dataSummary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-insights function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});