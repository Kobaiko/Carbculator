import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

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
    console.log('Starting generate-insights function');
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token received');

    // Initialize Supabase client with service role key for admin access
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get user from token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error('User authentication error:', userError);
      throw new Error('User authentication failed');
    }

    console.log('User authenticated:', user.id);

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      throw profileError;
    }

    console.log('Profile fetched:', profile);

    const dataSummary = {
      goals: {
        calories: profile?.daily_calories || 2000,
        protein: profile?.daily_protein || 150,
        carbs: profile?.daily_carbs || 250,
        fats: profile?.daily_fats || 70,
        water: profile?.daily_water || 2000,
      },
      metrics: {
        height: profile?.height,
        weight: profile?.weight,
        height_unit: profile?.height_unit,
        weight_unit: profile?.weight_unit,
      }
    };

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Calling OpenAI API');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a nutrition expert providing insights and recommendations. 
            Focus on overall patterns and best practices.
            Provide three types of insights:
            1. Trends: Analyze general nutrition patterns and metrics
            2. Recommendations: Provide actionable advice for maintaining a healthy diet
            3. Goals: Suggest realistic goals based on the user's targets
            Keep each section concise and focused.
            Use ** for important numbers or key points you want to emphasize.
            Do not include section headers in your response.`
          },
          {
            role: 'user',
            content: `Please provide nutrition insights and recommendations based on this user's data:
            ${JSON.stringify(dataSummary, null, 2)}`
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      throw new Error('OpenAI API error');
    }

    const aiData = await response.json();
    console.log('OpenAI response received');
    
    if (!aiData.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    const insights = {
      trends: aiData.choices[0].message.content.split('\n\n')[0],
      recommendations: aiData.choices[0].message.content.split('\n\n')[1],
      goals: aiData.choices[0].message.content.split('\n\n')[2],
    };

    console.log('Sending insights response');
    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-insights function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : undefined
      }), 
      {
        status: error.message === 'No authorization header' ? 401 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});