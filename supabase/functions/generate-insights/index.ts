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
    const { timeRange, startDate, endDate } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')?.split(' ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Prepare date range
    let dateFilter;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (timeRange) {
      case 'daily':
        dateFilter = {
          start: today.toISOString(),
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        };
        break;
      case 'weekly':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        dateFilter = { start: weekStart.toISOString(), end: weekEnd.toISOString() };
        break;
      case 'monthly':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        dateFilter = { start: monthStart.toISOString(), end: monthEnd.toISOString() };
        break;
      case 'yearly':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        const yearEnd = new Date(today.getFullYear(), 11, 31);
        dateFilter = { start: yearStart.toISOString(), end: yearEnd.toISOString() };
        break;
      case 'custom':
        dateFilter = {
          start: new Date(startDate).toISOString(),
          end: new Date(endDate).toISOString(),
        };
        break;
      default:
        throw new Error('Invalid time range');
    }

    // Fetch user's profile for goals
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Fetch food entries
    const { data: foodEntries } = await supabase
      .from('food_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', dateFilter.start)
      .lte('created_at', dateFilter.end);

    // Fetch water entries
    const { data: waterEntries } = await supabase
      .from('water_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', dateFilter.start)
      .lte('created_at', dateFilter.end);

    // Calculate totals and averages
    const totals = (foodEntries || []).reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + Number(entry.protein),
        carbs: acc.carbs + Number(entry.carbs),
        fats: acc.fats + Number(entry.fats),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    const waterTotal = (waterEntries || []).reduce((sum, entry) => sum + entry.amount, 0);
    const daysInRange = Math.ceil((new Date(dateFilter.end).getTime() - new Date(dateFilter.start).getTime()) / (1000 * 60 * 60 * 24));
    
    const averages = {
      calories: totals.calories / daysInRange,
      protein: totals.protein / daysInRange,
      carbs: totals.carbs / daysInRange,
      fats: totals.fats / daysInRange,
      water: waterTotal / daysInRange,
    };

    // Prepare data summary for OpenAI
    const dataSummary = {
      timeRange,
      daysInRange,
      totals,
      averages,
      goals: {
        calories: profile?.daily_calories || 2000,
        protein: profile?.daily_protein || 150,
        carbs: profile?.daily_carbs || 250,
        fats: profile?.daily_fats || 70,
        water: 2000, // Default water goal
      },
    };

    // Generate insights using OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a nutrition expert analyzing health data. Provide three types of insights:
            1. Trends: Analyze patterns in nutrition and water intake data
            2. Recommendations: Provide actionable advice based on the data
            3. Goals: Suggest realistic goals and adjustments based on current progress
            Keep each section concise, focused, and data-driven.`
          },
          {
            role: 'user',
            content: `Please analyze this health data and provide insights. The data is for a ${timeRange} period:
            ${JSON.stringify(dataSummary, null, 2)}`
          }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const aiData = await response.json();
    const insights = {
      trends: aiData.choices[0].message.content.split('\n\n')[0],
      recommendations: aiData.choices[0].message.content.split('\n\n')[1],
      goals: aiData.choices[0].message.content.split('\n\n')[2],
    };

    return new Response(JSON.stringify(insights), {
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