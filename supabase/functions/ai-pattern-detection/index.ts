
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Analyze bid patterns to detect potential collusion or irregularities
async function analyzeBidPatterns(
  supabaseClient: any,
  tenderId: string,
  supplierIds: string[]
): Promise<{
  score: number,
  patterns: any[],
  graphData: any
}> {
  console.log(`Analyzing bid patterns for tender ${tenderId} with ${supplierIds.length} suppliers`);
  
  // Get all bids for the tender
  const { data: bids, error: bidsError } = await supabaseClient
    .from('bids')
    .select('*, supplier:supplier_id(company_name, full_name)')
    .eq('tender_id', tenderId);
  
  if (bidsError) {
    console.error('Error fetching bids:', bidsError);
    throw bidsError;
  }
  
  // Get tender details
  const { data: tender, error: tenderError } = await supabaseClient
    .from('tenders')
    .select('*')
    .eq('id', tenderId)
    .single();
  
  if (tenderError) {
    console.error('Error fetching tender:', tenderError);
    throw tenderError;
  }
  
  // In a real implementation, this would use sophisticated AI algorithms
  // For this example, we'll use heuristic approaches
  
  const patterns = [];
  let riskScore = 0;
  
  // Check for pricing patterns
  if (bids && bids.length > 1) {
    const bidAmounts = bids.map(bid => bid.bid_amount);
    const averageBid = bidAmounts.reduce((sum, amount) => sum + amount, 0) / bidAmounts.length;
    const budgetAmount = tender.budget_amount || 0;
    
    // Check for bids that are suspiciously close to budget
    const closeTobudgetBids = bids.filter(bid => {
      const ratio = bid.bid_amount / budgetAmount;
      return ratio > 0.95 && ratio < 1;
    });
    
    if (closeTobudgetBids.length > 0) {
      patterns.push({
        type: 'pricing_suspicion',
        description: `${closeTobudgetBids.length} bids are suspiciously close to budget (>95%)`,
        severity: 'medium',
        score: 25,
        affected_bids: closeTobudgetBids.map(bid => bid.id)
      });
      riskScore += 25;
    }
    
    // Check for abnormally low bids
    const lowBids = bids.filter(bid => {
      const ratio = bid.bid_amount / averageBid;
      return ratio < 0.7;
    });
    
    if (lowBids.length > 0) {
      patterns.push({
        type: 'low_bid_suspicion',
        description: `${lowBids.length} bids are abnormally low (<70% of average)`,
        severity: 'medium',
        score: 20,
        affected_bids: lowBids.map(bid => bid.id)
      });
      riskScore += 20;
    }
    
    // Check for clustering of bid prices
    const bidGroups: {[key: string]: any[]} = {};
    bids.forEach(bid => {
      // Round to nearest 5% of average bid
      const group = Math.round((bid.bid_amount / averageBid) * 20) / 20;
      if (!bidGroups[group]) bidGroups[group] = [];
      bidGroups[group].push(bid);
    });
    
    // Look for clusters
    Object.entries(bidGroups).forEach(([group, groupBids]) => {
      if (groupBids.length > 2 && bids.length > 5) {
        patterns.push({
          type: 'bid_clustering',
          description: `${groupBids.length} bids clustered around ${Math.round(parseFloat(group) * 100)}% of average bid`,
          severity: 'high',
          score: 30,
          affected_bids: groupBids.map(bid => bid.id)
        });
        riskScore += 30;
      }
    });
  }
  
  // Check for timing patterns
  if (bids && bids.length > 1) {
    // Sort bids by creation time
    const sortedBids = [...bids].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    // Check for bids submitted in quick succession
    const suspiciousTimingGroups = [];
    let currentGroup = [sortedBids[0]];
    
    for (let i = 1; i < sortedBids.length; i++) {
      const prevTime = new Date(sortedBids[i-1].created_at).getTime();
      const currTime = new Date(sortedBids[i].created_at).getTime();
      const timeDiff = (currTime - prevTime) / (1000 * 60); // difference in minutes
      
      if (timeDiff < 10) { // Suspiciously close (less than 10 minutes apart)
        currentGroup.push(sortedBids[i]);
      } else if (currentGroup.length > 1) {
        suspiciousTimingGroups.push([...currentGroup]);
        currentGroup = [sortedBids[i]];
      } else {
        currentGroup = [sortedBids[i]];
      }
    }
    
    if (currentGroup.length > 1) {
      suspiciousTimingGroups.push(currentGroup);
    }
    
    // Report suspicious timing groups
    suspiciousTimingGroups.forEach(group => {
      if (group.length > 1) {
        patterns.push({
          type: 'suspicious_timing',
          description: `${group.length} bids submitted within 10 minutes of each other`,
          severity: 'high',
          score: 35,
          affected_bids: group.map(bid => bid.id)
        });
        riskScore += 35;
      }
    });
  }
  
  // Generate graph data for visualization (in a real system, this would be more sophisticated)
  const nodes = [
    { id: tenderId, label: 'Tender', type: 'tender' },
    ...bids.map(bid => ({ 
      id: bid.id, 
      label: bid.supplier?.company_name || 'Unknown', 
      type: 'bid',
      amount: bid.bid_amount,
      created: bid.created_at
    }))
  ];
  
  const edges = bids.map(bid => ({
    source: bid.id,
    target: tenderId,
    type: 'bid_submission'
  }));
  
  // Look for possible relationships between suppliers
  // This is a simplification - in a real system, this would involve 
  // sophisticated entity resolution and network analysis
  for (let i = 0; i < bids.length; i++) {
    for (let j = i + 1; j < bids.length; j++) {
      const bidA = bids[i];
      const bidB = bids[j];
      
      // Check if bids are suspiciously related
      let relationScore = 0;
      
      // Similar bid amounts (within 2%)
      const amountRatio = Math.max(bidA.bid_amount, bidB.bid_amount) / 
                          Math.min(bidA.bid_amount, bidB.bid_amount);
      if (amountRatio < 1.02) relationScore += 30;
      
      // Submitted close in time (within 15 minutes)
      const timeA = new Date(bidA.created_at).getTime();
      const timeB = new Date(bidB.created_at).getTime();
      const timeDiff = Math.abs(timeA - timeB) / (1000 * 60);
      if (timeDiff < 15) relationScore += 30;
      
      // If we have a significant relationship score, add an edge
      if (relationScore > 40) {
        edges.push({
          source: bidA.id,
          target: bidB.id,
          type: 'suspicious_relation',
          weight: relationScore
        });
        
        if (!patterns.some(p => p.type === 'supplier_relation')) {
          patterns.push({
            type: 'supplier_relation',
            description: 'Suspicious relationships detected between suppliers',
            severity: 'high',
            score: 40,
            details: `Bids show patterns consistent with potential collusion`
          });
          riskScore += 40;
        }
      }
    }
  }
  
  // Cap the risk score at 100
  riskScore = Math.min(riskScore, 100);
  
  return {
    score: riskScore,
    patterns,
    graphData: { nodes, edges }
  };
}

// Check for red flags in the company's background and bidding history
async function analyzeCompanyBackground(
  supabaseClient: any,
  supplierId: string
): Promise<{
  score: number,
  flags: any[]
}> {
  // Get supplier profile
  const { data: profile, error: profileError } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', supplierId)
    .single();
  
  if (profileError) {
    console.error('Error fetching supplier profile:', profileError);
    throw profileError;
  }
  
  // Get supplier's bid history
  const { data: bids, error: bidsError } = await supabaseClient
    .from('bids')
    .select('*, tender:tender_id(*)')
    .eq('supplier_id', supplierId);
  
  if (bidsError) {
    console.error('Error fetching supplier bids:', bidsError);
    throw bidsError;
  }
  
  const flags = [];
  let riskScore = 0;
  
  // Check for high win rate (if data available)
  if (bids && bids.length > 0) {
    const wonBids = bids.filter(bid => bid.status === 'accepted');
    const winRate = wonBids.length / bids.length;
    
    if (winRate > 0.7 && bids.length > 5) {
      flags.push({
        type: 'high_win_rate',
        description: `Unusually high win rate of ${Math.round(winRate * 100)}% across ${bids.length} bids`,
        severity: 'medium',
        score: 30
      });
      riskScore += 30;
    }
  }
  
  // Check for consistent bidding patterns
  if (bids && bids.length > 2) {
    const bidToBudgetRatios = bids
      .filter(bid => bid.tender && bid.tender.budget_amount)
      .map(bid => bid.bid_amount / bid.tender.budget_amount);
    
    if (bidToBudgetRatios.length > 2) {
      // Calculate standard deviation
      const mean = bidToBudgetRatios.reduce((sum, ratio) => sum + ratio, 0) / bidToBudgetRatios.length;
      const variance = bidToBudgetRatios.reduce((sum, ratio) => sum + Math.pow(ratio - mean, 2), 0) / bidToBudgetRatios.length;
      const stdDev = Math.sqrt(variance);
      
      // Suspiciously consistent bidding pattern
      if (stdDev < 0.05) {
        flags.push({
          type: 'consistent_bid_pattern',
          description: `Suspiciously consistent bid-to-budget ratio (${Math.round(mean * 100)}% ± ${Math.round(stdDev * 100)}%)`,
          severity: 'high',
          score: 40
        });
        riskScore += 40;
      }
    }
  }
  
  // Check for verification flags
  if (profile) {
    if (profile.verification_status === 'flagged') {
      flags.push({
        type: 'identity_verification_issues',
        description: 'Company has flagged identity verification records',
        severity: 'high',
        score: 50
      });
      riskScore += 50;
    } else if (profile.verification_status === 'pending' || profile.verification_level === 'none') {
      flags.push({
        type: 'incomplete_verification',
        description: 'Company has not completed identity verification process',
        severity: 'medium',
        score: 25
      });
      riskScore += 25;
    }
    
    // Check risk score if available
    if (profile.risk_score && profile.risk_score > 30) {
      flags.push({
        type: 'elevated_risk_score',
        description: `Company has an elevated risk score of ${profile.risk_score}`,
        severity: 'medium',
        score: 20
      });
      riskScore += 20;
    }
  }
  
  // Cap the risk score at 100
  riskScore = Math.min(riskScore, 100);
  
  return {
    score: riskScore,
    flags
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
    const { 
      analysisType,
      tenderId,
      supplierIds,
      supplierId
    } = await req.json();
    
    if (!analysisType) {
      return new Response(
        JSON.stringify({ error: 'Analysis type is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Different analysis based on the requested type
    let result;
    
    switch (analysisType) {
      case 'bid_patterns':
        if (!tenderId || !supplierIds) {
          return new Response(
            JSON.stringify({ error: 'Tender ID and supplier IDs are required for bid pattern analysis' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
        result = await analyzeBidPatterns(supabaseClient, tenderId, supplierIds);
        break;
        
      case 'company_background':
        if (!supplierId) {
          return new Response(
            JSON.stringify({ error: 'Supplier ID is required for company background analysis' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
        result = await analyzeCompanyBackground(supabaseClient, supplierId);
        break;
        
      default:
        return new Response(
          JSON.stringify({ error: 'Unsupported analysis type' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
    
    // Record the analysis result
    const { data: analysisRecord, error: insertError } = await supabaseClient
      .from('behavior_analysis')
      .insert({
        entity_id: analysisType === 'bid_patterns' ? tenderId : supplierId,
        entity_type: analysisType === 'bid_patterns' ? 'tender' : 'user',
        analysis_type: analysisType,
        risk_score: result.score,
        analysis_data: result
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error recording analysis result:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to record analysis result' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        analysis_id: analysisRecord.id,
        analysis_type: analysisType,
        risk_score: result.score,
        results: result
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error performing AI pattern detection:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
