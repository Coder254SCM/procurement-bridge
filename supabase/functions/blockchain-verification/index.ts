
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simulate blockchain interaction
async function generateBlockchainHash(data: any): Promise<string> {
  // In a real implementation, this would call a blockchain API or node
  // For this example, we're creating a deterministic hash
  
  const encoder = new TextEncoder();
  const dataString = JSON.stringify({
    ...data,
    timestamp: new Date().toISOString()
  });
  
  // Use crypto.subtle for hashing
  const dataBuffer = encoder.encode(dataString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `0x${hashHex}`;
}

// Simulate storing hash on blockchain
async function storeOnBlockchain(hash: string, data: any): Promise<any> {
  // In a real implementation, this would interact with a blockchain
  // For this example, we're simulating the response
  
  // Simulate transaction processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate a transaction ID (would come from the blockchain in a real implementation)
  const txId = Array.from({length: 64}, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  
  return {
    success: true,
    transactionId: txId,
    hash: hash,
    timestamp: new Date().toISOString(),
    blockNumber: Math.floor(Math.random() * 1000000) + 9000000,
    network: "Hyperledger Fabric Test Network"
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Get request body
    const { verificationType, verificationData, businessId } = await req.json();
    
    if (!verificationType || !businessId) {
      return new Response(
        JSON.stringify({ error: 'Verification type and business ID are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    console.log(`Processing ${verificationType} verification for business ID ${businessId}`);
    
    // Generate blockchain hash
    const dataToHash = {
      user_id: user.id,
      business_id: businessId,
      verification_type: verificationType,
      verification_data: verificationData || {},
    };
    
    const hash = await generateBlockchainHash(dataToHash);
    console.log(`Generated hash: ${hash}`);
    
    // Store hash on blockchain (simulated)
    const blockchainResponse = await storeOnBlockchain(hash, dataToHash);
    console.log(`Blockchain transaction: ${blockchainResponse.transactionId}`);
    
    // Store verification record in database
    const { data: verificationRecord, error: insertError } = await supabaseClient
      .from('digital_identity_verification')
      .insert({
        user_id: user.id,
        business_id: businessId,
        verification_type: verificationType,
        verification_status: 'in_progress',
        verification_data: verificationData || {},
        blockchain_hash: hash
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error inserting verification record:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to store verification record' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Record blockchain transaction
    await supabaseClient
      .from('blockchain_transactions')
      .insert({
        entity_id: verificationRecord.id,
        hash: hash,
        transaction_type: 'identity_verification',
        status: 'confirmed',
        metadata: {
          blockchain_response: blockchainResponse,
          verification_type: verificationType
        }
      });
    
    // Update profile verification status
    await supabaseClient
      .from('profiles')
      .update({ 
        verification_status: 'in_progress' 
      })
      .eq('id', user.id);
    
    return new Response(
      JSON.stringify({
        success: true,
        verification_id: verificationRecord.id,
        blockchain_hash: hash,
        blockchain_transaction: blockchainResponse
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing blockchain verification:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
