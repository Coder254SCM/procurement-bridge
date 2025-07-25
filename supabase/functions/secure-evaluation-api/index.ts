import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { SQLInjectionProtector } from "../../../src/utils/sqlInjectionProtection.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecureEvaluationRequest {
  action: 'create' | 'update' | 'get' | 'list';
  evaluationId?: string;
  bidId?: string;
  data?: any;
  filters?: any;
  trialMode?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  let logData: any = { endpoint: 'secure-evaluation-api', method: req.method };

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

    const { action, evaluationId, bidId, data, filters, trialMode }: SecureEvaluationRequest = await req.json();
    
    logData = { ...logData, user_id: user.id, action, trialMode };

    // Security validation
    if (action) {
      const actionValidation = SQLInjectionProtector.validateInput(action, 'query');
      if (!actionValidation.isValid) {
        SQLInjectionProtector.logSecurityEvent('Invalid action parameter', { action, issues: actionValidation.issues }, 'high');
        throw new Error('Invalid action parameter');
      }
    }

    // Check user role - only evaluators can access this API
    const { data: userRoles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const hasEvaluatorRole = userRoles?.some(r => r.role === 'evaluator');
    if (!hasEvaluatorRole && !trialMode) {
      throw new Error('Evaluator role required');
    }

    // Check subscription status and trial eligibility
    const { data: subscriptionStatus } = await supabaseService.rpc('get_user_subscription_status', { user_id_param: user.id });
    const userStatus = subscriptionStatus?.[0];

    if (trialMode) {
      // Check trial eligibility
      const { data: isEligible } = await supabaseService.rpc('check_trial_eligibility', {
        user_id_param: user.id,
        trial_type_param: 'evaluation'
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
        if (!bidId) throw new Error('Bid ID required');

        // Validate evaluation data
        if (data?.score && (typeof data.score !== 'number' || data.score < 0 || data.score > 100)) {
          throw new Error('Invalid score - must be between 0 and 100');
        }

        const { data: newEvaluation, error: createError } = await supabaseService
          .from('evaluations')
          .insert({
            ...data,
            evaluator_id: user.id,
            bid_id: bidId,
            evaluation_type: trialMode ? 'trial' : 'standard'
          })
          .select()
          .single();

        if (createError) throw createError;

        // Record trial usage if in trial mode
        if (trialMode) {
          await supabaseService.from('user_trials').insert({
            user_id: user.id,
            trial_type: 'evaluation',
            trial_data: { evaluation_id: newEvaluation.id, bid_id: bidId, action: 'create' },
            ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
            user_agent: req.headers.get('user-agent')
          });
        }

        result = { evaluation: newEvaluation, trialUsed: trialMode };
        break;

      case 'update':
        if (!evaluationId) throw new Error('Evaluation ID required for update');

        const { data: updatedEvaluation, error: updateError } = await supabaseService
          .from('evaluations')
          .update(data)
          .eq('id', evaluationId)
          .eq('evaluator_id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;
        result = { evaluation: updatedEvaluation };
        break;

      case 'get':
        if (!evaluationId) throw new Error('Evaluation ID required');

        const { data: evaluation, error: getError } = await supabaseClient
          .from('evaluations')
          .select('*')
          .eq('id', evaluationId)
          .single();

        if (getError) throw getError;
        result = { evaluation };
        break;

      case 'list':
        let query = supabaseClient.from('evaluations').select('*');
        
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (typeof value === 'string') {
              const filterValidation = SQLInjectionProtector.validateInput(value, 'query');
              if (filterValidation.isValid) {
                query = query.eq(key, value);
              }
            }
          });
        }

        const { data: evaluations, error: listError } = await query;
        if (listError) throw listError;
        result = { evaluations };
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
    console.error('Secure evaluation API error:', error);
    
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