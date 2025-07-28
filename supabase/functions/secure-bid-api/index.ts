import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Security validation utilities
const validateInput = (input: string): boolean => {
  if (!input || typeof input !== 'string') return false;
  
  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(--|\/\*|\*\/|;|\bOR\b|\bAND\b)/i,
    /('|(\\x)|(char\s*\()|(sp_)|(xp_))/i
  ];
  
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi
  ];
  
  return !sqlInjectionPatterns.some(pattern => pattern.test(input)) &&
         !xssPatterns.some(pattern => pattern.test(input));
};

const logSecurityEvent = (event: string, details: any, risk: string) => {
  console.warn(`[SECURITY-${risk.toUpperCase()}] ${event}:`, details);
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecureBidRequest {
  action: 'create' | 'update' | 'delete' | 'get' | 'list';
  bidId?: string;
  tenderId?: string;
  data?: any;
  filters?: any;
  trialMode?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  let logData: any = { endpoint: 'secure-bid-api', method: req.method };

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

    const { action, bidId, tenderId, data, filters, trialMode }: SecureBidRequest = await req.json();
    
    logData = { ...logData, user_id: user.id, action, trialMode };

    // Security validation
    if (action && !validateInput(action)) {
      logSecurityEvent('Invalid action parameter', { action }, 'high');
      throw new Error('Invalid action parameter');
    }

    // Check subscription status and trial eligibility
    const { data: subscriptionStatus } = await supabaseService.rpc('get_user_subscription_status', { user_id_param: user.id });
    const userStatus = subscriptionStatus?.[0];

    if (trialMode) {
      // Check trial eligibility
      const { data: isEligible } = await supabaseService.rpc('check_trial_eligibility', {
        user_id_param: user.id,
        trial_type_param: 'bid_submission'
      });

      if (!isEligible) {
        return new Response(JSON.stringify({ 
          error: 'Trial already used',
          requiresSubscription: true,
          message: 'You have already used your free trial. Please subscribe to continue.'
        }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } else if (!userStatus?.has_active_subscription) {
      return new Response(JSON.stringify({ 
        error: 'Subscription required',
        requiresSubscription: true,
        trialAvailable: userStatus?.trial_available,
        message: 'An active subscription is required for this operation.'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let result;

    switch (action) {
      case 'create':
        if (!tenderId) throw new Error('Tender ID required');

        // Validate bid data
        if (data?.bid_amount && typeof data.bid_amount !== 'number') {
          throw new Error('Invalid bid amount');
        }

        const { data: newBid, error: createError } = await supabaseService
          .from('bids')
          .insert({
            ...data,
            supplier_id: user.id,
            tender_id: tenderId,
            status: trialMode ? 'trial' : 'submitted'
          })
          .select()
          .single();

        if (createError) throw createError;

        // Record trial usage if in trial mode
        if (trialMode) {
          await supabaseService.from('user_trials').insert({
            user_id: user.id,
            trial_type: 'bid_submission',
            trial_data: { bid_id: newBid.id, tender_id: tenderId, action: 'create' },
            ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
            user_agent: req.headers.get('user-agent')
          });
        }

        result = { bid: newBid, trialUsed: trialMode };
        break;

      case 'update':
        if (!bidId) throw new Error('Bid ID required for update');

        const { data: updatedBid, error: updateError } = await supabaseService
          .from('bids')
          .update(data)
          .eq('id', bidId)
          .eq('supplier_id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;
        result = { bid: updatedBid };
        break;

      case 'get':
        if (!bidId) throw new Error('Bid ID required');

        const { data: bid, error: getError } = await supabaseClient
          .from('bids')
          .select('*')
          .eq('id', bidId)
          .single();

        if (getError) throw getError;
        result = { bid };
        break;

      case 'list':
        let query = supabaseClient.from('bids').select('*');
        
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (typeof value === 'string' && validateInput(value)) {
              query = query.eq(key, value);
            }
          });
        }

        const { data: bids, error: listError } = await query;
        if (listError) throw listError;
        result = { bids };
        break;

      default:
        throw new Error('Invalid action');
    }

    // Log successful API call
    const responseTime = Date.now() - startTime;
    await supabaseService.from('api_access_logs').insert({
      ...logData,
      response_status: 200,
      response_time_ms: responseTime,
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      user_agent: req.headers.get('user-agent')
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Secure bid API error:', error);
    
    const responseTime = Date.now() - startTime;
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    await supabaseService.from('api_access_logs').insert({
      ...logData,
      response_status: 500,
      response_time_ms: responseTime,
      error_message: error.message,
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      user_agent: req.headers.get('user-agent')
    });

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});