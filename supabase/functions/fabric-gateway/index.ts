
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0";

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
};

// Simulate Hyperledger Fabric operations (in production, this would use the Fabric SDK)
const simulateFabricOperation = async (operation: string, payload: any) => {
  // This is a simulation - in production, this would use the Fabric SDK
  // to interact with the Hyperledger Fabric network
  
  const txId = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  
  // Return simulated transaction details
  return {
    success: true,
    txId,
    timestamp,
    operation,
    payload
  };
};

// Serve HTTP requests
serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  try {
    // Get request data
    const { operation, payload } = await req.json();
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Perform the requested blockchain operation
    const result = await simulateFabricOperation(operation, payload);
    
    // Store transaction record in the database
    const { data, error } = await supabase
      .from('blockchain_transactions')
      .insert({
        transaction_type: operation,
        entity_id: payload.id || '',
        hash: result.txId,
        status: 'confirmed',
        metadata: payload
      });
    
    if (error) {
      console.error("Error storing transaction:", error);
    }
    
    // Return the result
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error processing request:", error);
    
    // Return error response
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
