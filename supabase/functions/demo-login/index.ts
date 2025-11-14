import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DemoAccount {
  email: string;
  password: string;
  full_name: string;
  account_type: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accountType } = await req.json();

    if (!accountType || typeof accountType !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid account type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create service role client to access demo_accounts securely
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

    // Fetch demo account credentials server-side (passwords never sent to client)
    const { data: demoAccount, error: fetchError } = await supabaseAdmin
      .from('demo_accounts')
      .select('email, password, full_name, account_type')
      .eq('account_type', accountType)
      .single();

    if (fetchError || !demoAccount) {
      console.error('Demo account fetch error:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Demo account not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, password, full_name } = demoAccount as DemoAccount;

    // Create anon client for authentication
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Try to sign in first
    let { data: signInData, error: signInError } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    // If user doesn't exist, create account server-side
    if (signInError?.message?.includes('Invalid login credentials')) {
      const { data: signUpData, error: signUpError } = await supabaseAuth.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            account_type: accountType,
          },
          emailRedirectTo: `${req.headers.get('origin')}/dashboard`,
        },
      });

      if (signUpError) {
        console.error('Demo signup error:', signUpError);
        return new Response(
          JSON.stringify({ error: 'Failed to create demo account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Sign in after signup
      const { data: signInAfterSignUpData, error: signInAfterSignUpError } = await supabaseAuth.auth.signInWithPassword({
        email,
        password,
      });

      if (signInAfterSignUpError) {
        console.error('Demo signin after signup error:', signInAfterSignUpError);
        return new Response(
          JSON.stringify({ error: 'Failed to sign in to demo account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      signInData = signInAfterSignUpData;
    } else if (signInError) {
      console.error('Demo signin error:', signInError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return session data to client
    return new Response(
      JSON.stringify({
        session: signInData.session,
        user: signInData.user,
        full_name,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Demo login error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
