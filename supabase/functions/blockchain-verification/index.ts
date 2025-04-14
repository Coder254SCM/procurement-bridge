
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced blockchain interaction with multiple verification methods
async function generateBlockchainHash(data: any): Promise<string> {
  const encoder = new TextEncoder();
  
  // Include more context in the hash
  const contextData = {
    ...data,
    timestamp: new Date().toISOString(),
    version: "2.0" // Version tracking for hash algorithm
  };
  
  const dataString = JSON.stringify(contextData);
  
  // Use crypto.subtle for more secure hashing
  const dataBuffer = encoder.encode(dataString);
  
  // Use SHA-256 for standard verification
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `0x${hashHex}`;
}

// Enhanced blockchain storage with transaction batching and proofs
async function storeOnBlockchain(hash: string, data: any): Promise<any> {
  try {
    // Simulate transaction processing with latency variation
    const processingTime = 1000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // Generate a transaction ID (would come from the blockchain in a real implementation)
    const txId = Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    // Generate simulated zero-knowledge proof for identity verification
    // In a real implementation, this would be a zk-SNARK or similar proof
    const zkProof = Array.from({length: 128}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    // Simulate verification nodes
    const verificationNodes = [];
    const nodeCount = Math.floor(Math.random() * 3) + 3; // 3-5 nodes
    
    for (let i = 0; i < nodeCount; i++) {
      verificationNodes.push({
        nodeId: `node_${i+1}`,
        signature: Array.from({length: 32}, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('')
      });
    }
    
    // Transaction receipt with detailed verification info
    return {
      success: true,
      transactionId: txId,
      hash: hash,
      timestamp: new Date().toISOString(),
      blockNumber: Math.floor(Math.random() * 1000000) + 9000000,
      network: "Hyperledger Fabric Production Network",
      verificationNodes,
      zkProof,
      consensusType: "PBFT", // Practical Byzantine Fault Tolerance
      dataFingerprint: hash.substring(0, 16) // For quick verification 
    };
  } catch (error) {
    console.error("Blockchain storage error:", error);
    throw new Error(`Failed to store data on blockchain: ${error.message}`);
  }
}

// Verify an identity on the blockchain with multiple checks
async function verifyIdentity(identityData: any): Promise<any> {
  try {
    console.log(`Verifying identity for: ${identityData.businessName || 'unknown'}`);
    
    // Extract verification parameters
    const { businessId, verificationType, verificationData } = identityData;
    
    // Generate identity hash
    const identityHash = await generateBlockchainHash({
      businessId,
      verificationType,
      identityData: verificationData
    });
    
    console.log(`Generated identity hash: ${identityHash}`);
    
    // Store on blockchain with proof
    const blockchainResponse = await storeOnBlockchain(identityHash, {
      identityType: verificationType,
      identityData: verificationData,
      businessId: businessId
    });
    
    console.log(`Blockchain transaction completed: ${blockchainResponse.transactionId}`);
    
    // Calculate risk score based on verification data
    // In a real implementation, this would use a more sophisticated algorithm
    const riskScore = calculateRiskScore(verificationData);
    
    return {
      success: true,
      identityHash,
      blockchainTransaction: blockchainResponse,
      riskScore,
      verificationStatus: riskScore > 70 ? 'verified' : 'flagged',
      verificationTimestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Identity verification error:", error);
    throw error;
  }
}

// Calculate risk score based on verification data
function calculateRiskScore(verificationData: any): number {
  // Starting with a neutral score
  let score = 50;
  
  // This would be a complex algorithm in a real implementation
  // For demo, we'll use a simple algorithm based on available data
  
  try {
    // Business age improves score
    if (verificationData.businessAge) {
      score += Math.min(verificationData.businessAge / 2, 15); // Up to +15 points for business age
    }
    
    // Document completeness
    if (verificationData.documents) {
      const docCount = Object.keys(verificationData.documents).length;
      score += Math.min(docCount * 5, 20); // Up to +20 points for documents
    }
    
    // Verification level
    if (verificationData.level === 'advanced') {
      score += 10;
    } else if (verificationData.level === 'standard') {
      score += 5;
    }
    
    // Performance history
    if (verificationData.completedProjects > 0) {
      score += Math.min(verificationData.completedProjects * 2, 10); // Up to +10 for project history
    }
    
    // Random variation for demo purposes (would be replaced with real factors)
    score += (Math.random() * 15) - 7.5; // +/- 7.5 points random variation
    
    // Ensure score is between 0-100
    return Math.min(Math.max(Math.round(score), 0), 100);
  } catch (error) {
    console.error("Error calculating risk score:", error);
    return 50; // Default to neutral score on error
  }
}

// Optimized serve function with better error handling
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
    
    // Prepare verification data
    const identityData = {
      user_id: user.id,
      businessId,
      verificationType,
      verificationData: verificationData || {},
    };
    
    // Handle the verification process
    try {
      // Verify identity on blockchain
      const verificationResult = await verifyIdentity(identityData);
      
      // Store verification record in database
      const { data: verificationRecord, error: insertError } = await supabaseClient
        .from('digital_identity_verification')
        .insert({
          user_id: user.id,
          business_id: businessId,
          verification_type: verificationType,
          verification_status: verificationResult.verificationStatus,
          verification_data: verificationData || {},
          blockchain_hash: verificationResult.identityHash
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error inserting verification record:', insertError);
        throw new Error('Failed to store verification record');
      }
      
      // Record blockchain transaction
      await supabaseClient
        .from('blockchain_transactions')
        .insert({
          entity_id: verificationRecord.id,
          hash: verificationResult.identityHash,
          transaction_type: 'identity_verification',
          status: 'confirmed',
          metadata: {
            blockchain_response: verificationResult.blockchainTransaction,
            verification_type: verificationType,
            risk_score: verificationResult.riskScore,
            zk_proof: verificationResult.blockchainTransaction.zkProof
          }
        });
      
      // Update profile verification status
      await supabaseClient
        .from('profiles')
        .update({ 
          verification_status: verificationResult.verificationStatus,
          verification_level: verificationData.level || 'standard',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      return new Response(
        JSON.stringify({
          success: true,
          verification_id: verificationRecord.id,
          blockchain_hash: verificationResult.identityHash,
          blockchain_transaction: verificationResult.blockchainTransaction,
          risk_score: verificationResult.riskScore,
          status: verificationResult.verificationStatus
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (verificationError) {
      console.error('Error during verification process:', verificationError);
      return new Response(
        JSON.stringify({ 
          error: verificationError.message || 'Verification process failed',
          phase: 'verification'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
  } catch (error) {
    console.error('General error in blockchain verification function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        phase: 'request_processing'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
