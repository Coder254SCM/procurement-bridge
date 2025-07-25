import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TrialStatusRequest {
  action: 'check-eligibility' | 'subscription-status' | 'get-plans';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase clients
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Invalid authentication");
    }

    const { action }: TrialStatusRequest = await req.json();

    let result;

    switch (action) {
      case 'check-eligibility':
        // Check trial eligibility for all types
        const { data: tenderEligible } = await supabaseService.rpc('check_trial_eligibility', {
          user_id_param: user.id,
          trial_type_param: 'tender_creation'
        });

        const { data: bidEligible } = await supabaseService.rpc('check_trial_eligibility', {
          user_id_param: user.id,
          trial_type_param: 'bid_submission'
        });

        const { data: evaluationEligible } = await supabaseService.rpc('check_trial_eligibility', {
          user_id_param: user.id,
          trial_type_param: 'evaluation'
        });

        // Get used trials
        const { data: usedTrials } = await supabaseClient
          .from('user_trials')
          .select('trial_type, used_at')
          .eq('user_id', user.id);

        result = {
          eligibility: {
            tender_creation: tenderEligible,
            bid_submission: bidEligible,
            evaluation: evaluationEligible
          },
          usedTrials: usedTrials || [],
          hasAnyTrialAvailable: tenderEligible || bidEligible || evaluationEligible
        };
        break;

      case 'subscription-status':
        // Get subscription status
        const { data: subscriptionStatus } = await supabaseService.rpc('get_user_subscription_status', { 
          user_id_param: user.id 
        });

        const userStatus = subscriptionStatus?.[0];

        // Get current subscription details
        const { data: currentSubscription } = await supabaseClient
          .from('user_subscriptions')
          .select(`
            *,
            subscription_plans (*)
          `)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        result = {
          hasActiveSubscription: userStatus?.has_active_subscription || false,
          planName: userStatus?.plan_name || 'None',
          status: userStatus?.status || 'none',
          trialAvailable: userStatus?.trial_available || false,
          currentSubscription: currentSubscription || null
        };
        break;

      case 'get-plans':
        // Get available subscription plans
        const { data: plans } = await supabaseClient
          .from('subscription_plans')
          .select('*')
          .eq('active', true)
          .order('price_monthly', { ascending: true });

        result = { plans: plans || [] };
        break;

      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Trial status API error:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});