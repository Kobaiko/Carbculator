import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

serve(async (req) => {
  try {
    const { record } = await req.json();
    console.log('Handling new user:', record.id);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', record.id)
      .single();

    if (existingProfile) {
      console.log('Profile already exists for user:', record.id);
      return new Response(JSON.stringify({ success: true, message: 'Profile already exists' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create new profile with all required fields
    const { error } = await supabase
      .from('profiles')
      .insert([
        {
          id: record.id,
          daily_calories: 2000,
          daily_protein: 150,
          daily_carbs: 250,
          daily_fats: 70,
          daily_water: 2000,
          height_unit: 'cm',
          weight_unit: 'kg',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }

    console.log('Successfully created profile for user:', record.id);
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in handle-new-user function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});