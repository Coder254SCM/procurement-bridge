
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Smart contract definitions - this represents the chaincode deployed on the Hyperledger Fabric network
const chaincodeDefs = {
  tender: {
    name: "tender",
    version: "1.0",
    functions: {
      createTender: {
        description: "Create a new tender on the blockchain",
        params: [
          { name: "id", type: "string", description: "Unique ID for the tender" },
          { name: "data", type: "object", description: "Tender details" },
          { name: "hash", type: "string", description: "Content hash for verification" }
        ],
        returns: { type: "object", description: "Transaction result with ID" }
      },
      queryTender: {
        description: "Query tender details from the blockchain",
        params: [
          { name: "id", type: "string", description: "Unique ID for the tender" }
        ],
        returns: { type: "object", description: "Tender details" }
      },
      updateTender: {
        description: "Update tender status or details",
        params: [
          { name: "id", type: "string", description: "Unique ID for the tender" },
          { name: "status", type: "string", description: "New tender status" },
          { name: "data", type: "object", description: "Updated tender details" }
        ],
        returns: { type: "object", description: "Transaction result" }
      }
    }
  },
  bid: {
    name: "bid",
    version: "1.0",
    functions: {
      submitBid: {
        description: "Submit a new bid for a tender",
        params: [
          { name: "id", type: "string", description: "Unique ID for the bid" },
          { name: "tenderId", type: "string", description: "ID of the tender" },
          { name: "data", type: "object", description: "Bid details" },
          { name: "hash", type: "string", description: "Content hash for verification" }
        ],
        returns: { type: "object", description: "Transaction result with ID" }
      },
      queryBid: {
        description: "Query bid details from the blockchain",
        params: [
          { name: "id", type: "string", description: "Unique ID for the bid" }
        ],
        returns: { type: "object", description: "Bid details" }
      },
      getBidsForTender: {
        description: "Get all bids for a specific tender",
        params: [
          { name: "tenderId", type: "string", description: "ID of the tender" }
        ],
        returns: { type: "array", description: "List of bids for the tender" }
      }
    }
  },
  evaluation: {
    name: "evaluation",
    version: "1.0",
    functions: {
      evaluateBid: {
        description: "Record an evaluation for a bid",
        params: [
          { name: "id", type: "string", description: "Unique ID for the evaluation" },
          { name: "bidId", type: "string", description: "ID of the bid being evaluated" },
          { name: "data", type: "object", description: "Evaluation details and scores" },
          { name: "hash", type: "string", description: "Content hash for verification" }
        ],
        returns: { type: "object", description: "Transaction result with ID" }
      },
      queryEvaluation: {
        description: "Query evaluation details from the blockchain",
        params: [
          { name: "id", type: "string", description: "Unique ID for the evaluation" }
        ],
        returns: { type: "object", description: "Evaluation details" }
      },
      getEvaluationsForBid: {
        description: "Get all evaluations for a specific bid",
        params: [
          { name: "bidId", type: "string", description: "ID of the bid" }
        ],
        returns: { type: "array", description: "List of evaluations for the bid" }
      }
    }
  },
  award: {
    name: "award",
    version: "1.0",
    functions: {
      awardTender: {
        description: "Record a tender award decision",
        params: [
          { name: "id", type: "string", description: "Unique ID for the award" },
          { name: "tenderId", type: "string", description: "ID of the tender being awarded" },
          { name: "bidId", type: "string", description: "ID of the winning bid" },
          { name: "data", type: "object", description: "Award details" },
          { name: "hash", type: "string", description: "Content hash for verification" }
        ],
        returns: { type: "object", description: "Transaction result with ID" }
      },
      queryAward: {
        description: "Query award details from the blockchain",
        params: [
          { name: "id", type: "string", description: "Unique ID for the award" }
        ],
        returns: { type: "object", description: "Award details" }
      }
    }
  },
  system: {
    name: "system",
    version: "1.0",
    functions: {
      getTransactionHistory: {
        description: "Get transaction history for an entity",
        params: [
          { name: "entityId", type: "string", description: "ID of the entity" },
          { name: "entityType", type: "string", description: "Type of entity (tender, bid, etc.)" }
        ],
        returns: { type: "array", description: "Transaction history" }
      },
      verifyContentHash: {
        description: "Verify content hash against blockchain record",
        params: [
          { name: "entityId", type: "string", description: "ID of the entity" },
          { name: "hash", type: "string", description: "Hash to verify" }
        ],
        returns: { type: "boolean", description: "Verification result" }
      },
      getChainInfo: {
        description: "Get information about the blockchain",
        params: [],
        returns: { type: "object", description: "Chain information" }
      }
    }
  }
};

// Process chaincode definition request
async function handleChaincodeRequest(contract: string) {
  const chaincodeContract = chaincodeDefs[contract];
  
  if (!chaincodeContract) {
    return {
      error: `Contract ${contract} not found`,
      availableContracts: Object.keys(chaincodeDefs)
    };
  }
  
  return {
    name: chaincodeContract.name,
    version: chaincodeContract.version,
    functions: chaincodeContract.functions
  };
}

// HTTP server
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get client from auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    // Get the user session
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Parse request URL
    const url = new URL(req.url);
    const path = url.pathname.split('/');
    
    // Handle different API routes
    if (path[path.length - 2] === 'contracts' && path.length > 1) {
      // Get contract definition
      const contractName = path[path.length - 1];
      const result = await handleChaincodeRequest(contractName);
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (path[path.length - 1] === 'contracts') {
      // List available contracts
      return new Response(
        JSON.stringify({
          contracts: Object.keys(chaincodeDefs)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Default - show all chaincode definitions
      return new Response(
        JSON.stringify({
          chaincodeDefinitions: chaincodeDefs,
          networkInfo: {
            name: "ProcureChain Hyperledger Fabric Network",
            version: "2.2.0",
            channelName: "procurechannel",
            blocksCount: Math.floor(Math.random() * 100000) + 1000000
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error processing chaincode explorer request:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
