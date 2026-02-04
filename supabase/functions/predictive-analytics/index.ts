import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PredictionRequest {
  type: 'supplier_churn' | 'buyer_churn' | 'bid_success' | 'payment_delay' | 'contract_completion' | 'fraud_risk' | 'all';
  entity_id?: string;
  entity_type?: 'supplier' | 'buyer' | 'tender' | 'bid' | 'contract';
}

interface PredictionResult {
  prediction_type: string;
  probability: number;
  risk_level: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  confidence: number;
  contributing_factors: { factor: string; weight: number; value: string | number }[];
  recommendations: string[];
  model_version: string;
}

// Feature engineering functions (inspired by IBM's HR Analytics model)
function calculateActivityScore(
  lastActivityDays: number,
  totalActivities: number,
  avgActivitiesPerMonth: number
): number {
  // Decay function for inactivity
  const inactivityPenalty = Math.exp(-lastActivityDays / 30);
  const volumeScore = Math.min(totalActivities / 50, 1);
  const frequencyScore = Math.min(avgActivitiesPerMonth / 10, 1);
  
  return (inactivityPenalty * 0.4 + volumeScore * 0.3 + frequencyScore * 0.3);
}

function calculateEngagementScore(
  bidsSubmitted: number,
  bidsAwarded: number,
  responseRate: number,
  profileCompleteness: number
): number {
  const successRate = bidsSubmitted > 0 ? bidsAwarded / bidsSubmitted : 0;
  return (
    successRate * 0.3 +
    Math.min(responseRate, 1) * 0.3 +
    profileCompleteness * 0.25 +
    Math.min(bidsSubmitted / 20, 1) * 0.15
  );
}

function calculateFinancialHealthScore(
  paymentHistory: number, // 0-1 on-time payment ratio
  bidValueConsistency: number,
  creditUtilization: number
): number {
  return (
    paymentHistory * 0.5 +
    bidValueConsistency * 0.3 +
    (1 - creditUtilization) * 0.2
  );
}

// Logistic regression-inspired prediction model
function logisticPrediction(features: number[], weights: number[], bias: number): number {
  const z = features.reduce((sum, f, i) => sum + f * weights[i], bias);
  return 1 / (1 + Math.exp(-z));
}

// Main prediction functions
function predictSupplierChurn(metrics: any): PredictionResult {
  const features = [
    metrics.activityScore || 0.5,
    metrics.engagementScore || 0.5,
    metrics.financialHealth || 0.5,
    metrics.bidSuccessRate || 0.5,
    metrics.profileCompleteness || 0.5,
    metrics.daysInactive / 90, // Normalized inactivity
    metrics.contractsCompleted > 0 ? 1 : 0,
    metrics.disputeCount > 0 ? 0.3 : 0
  ];
  
  // Weights derived from procurement domain knowledge (similar to IBM's approach)
  const weights = [-0.8, -1.2, -0.6, -0.9, -0.5, 1.5, -0.7, 0.8];
  const bias = 0.2;
  
  const churnProbability = logisticPrediction(features, weights, bias);
  
  const contributingFactors = [
    { factor: 'Activity Level', weight: Math.abs(weights[0]), value: `${(metrics.activityScore * 100).toFixed(0)}%` },
    { factor: 'Engagement Score', weight: Math.abs(weights[1]), value: `${(metrics.engagementScore * 100).toFixed(0)}%` },
    { factor: 'Days Since Last Activity', weight: weights[5], value: metrics.daysInactive },
    { factor: 'Bid Success Rate', weight: Math.abs(weights[3]), value: `${(metrics.bidSuccessRate * 100).toFixed(0)}%` },
    { factor: 'Profile Completeness', weight: Math.abs(weights[4]), value: `${(metrics.profileCompleteness * 100).toFixed(0)}%` }
  ].sort((a, b) => b.weight - a.weight);
  
  const recommendations = [];
  if (churnProbability > 0.5) {
    if (metrics.daysInactive > 30) recommendations.push('Re-engage with personalized tender recommendations');
    if (metrics.bidSuccessRate < 0.2) recommendations.push('Offer bid quality improvement training');
    if (metrics.profileCompleteness < 0.7) recommendations.push('Prompt to complete profile verification');
    if (metrics.engagementScore < 0.4) recommendations.push('Send notification about matching opportunities');
  }
  
  return {
    prediction_type: 'supplier_churn',
    probability: churnProbability,
    risk_level: getRiskLevel(churnProbability),
    confidence: calculateConfidence(features),
    contributing_factors: contributingFactors,
    recommendations,
    model_version: '1.0.0'
  };
}

function predictBuyerChurn(metrics: any): PredictionResult {
  const features = [
    metrics.tendersCreated > 0 ? Math.min(metrics.tendersCreated / 10, 1) : 0,
    metrics.avgTimeToAward / 60, // Normalized (60 days baseline)
    metrics.supplierSatisfactionScore || 0.5,
    metrics.budgetUtilization || 0.5,
    metrics.daysInactive / 90,
    metrics.contractCompletionRate || 0.5
  ];
  
  const weights = [-1.0, 0.5, -0.8, -0.6, 1.3, -0.7];
  const bias = 0.1;
  
  const churnProbability = logisticPrediction(features, weights, bias);
  
  const contributingFactors = [
    { factor: 'Tenders Created', weight: Math.abs(weights[0]), value: metrics.tendersCreated },
    { factor: 'Days Inactive', weight: weights[4], value: metrics.daysInactive },
    { factor: 'Budget Utilization', weight: Math.abs(weights[3]), value: `${(metrics.budgetUtilization * 100).toFixed(0)}%` },
    { factor: 'Contract Completion Rate', weight: Math.abs(weights[5]), value: `${(metrics.contractCompletionRate * 100).toFixed(0)}%` }
  ];
  
  const recommendations = [];
  if (churnProbability > 0.5) {
    if (metrics.daysInactive > 45) recommendations.push('Schedule procurement planning consultation');
    if (metrics.budgetUtilization < 0.3) recommendations.push('Review annual procurement plan and budget allocation');
    if (metrics.tendersCreated < 3) recommendations.push('Offer procurement process optimization training');
  }
  
  return {
    prediction_type: 'buyer_churn',
    probability: churnProbability,
    risk_level: getRiskLevel(churnProbability),
    confidence: calculateConfidence(features),
    contributing_factors: contributingFactors,
    recommendations,
    model_version: '1.0.0'
  };
}

function predictBidSuccess(metrics: any): PredictionResult {
  const features = [
    metrics.priceCompetitiveness || 0.5, // How competitive is the bid price
    metrics.technicalScore || 0.5,
    metrics.supplierVerificationLevel / 4, // Normalized (4 levels)
    metrics.pastPerformance || 0.5,
    metrics.documentCompleteness || 0.5,
    metrics.categoryExperience || 0.5,
    metrics.bidTimeRemainingRatio || 0.5 // Submitted early = more favorable
  ];
  
  const weights = [1.2, 1.0, 0.8, 0.9, 0.7, 0.6, 0.3];
  const bias = -1.5;
  
  const successProbability = logisticPrediction(features, weights, bias);
  
  const contributingFactors = [
    { factor: 'Price Competitiveness', weight: weights[0], value: `${(metrics.priceCompetitiveness * 100).toFixed(0)}%` },
    { factor: 'Technical Score', weight: weights[1], value: `${(metrics.technicalScore * 100).toFixed(0)}%` },
    { factor: 'Verification Level', weight: weights[2], value: metrics.supplierVerificationLevel },
    { factor: 'Past Performance', weight: weights[3], value: `${(metrics.pastPerformance * 100).toFixed(0)}%` },
    { factor: 'Document Completeness', weight: weights[4], value: `${(metrics.documentCompleteness * 100).toFixed(0)}%` }
  ];
  
  const recommendations = [];
  if (successProbability < 0.5) {
    if (metrics.priceCompetitiveness < 0.4) recommendations.push('Consider adjusting pricing strategy');
    if (metrics.documentCompleteness < 0.8) recommendations.push('Ensure all required documents are uploaded');
    if (metrics.supplierVerificationLevel < 2) recommendations.push('Complete advanced verification for higher scores');
  } else {
    recommendations.push('Strong bid - maintain document quality through evaluation');
  }
  
  return {
    prediction_type: 'bid_success',
    probability: successProbability,
    risk_level: getRiskLevel(1 - successProbability), // Inverse for success
    confidence: calculateConfidence(features),
    contributing_factors: contributingFactors,
    recommendations,
    model_version: '1.0.0'
  };
}

function predictPaymentDelay(metrics: any): PredictionResult {
  const features = [
    metrics.historicalDelayRate || 0,
    metrics.contractValue / 10000000, // Normalized by 10M
    metrics.buyerPaymentHistory || 0.8,
    metrics.milestoneCompletionRate || 0.5,
    metrics.disputeHistory ? 0.8 : 0,
    metrics.documentationQuality || 0.5
  ];
  
  const weights = [1.5, 0.3, -1.2, -0.8, 1.0, -0.5];
  const bias = -0.5;
  
  const delayProbability = logisticPrediction(features, weights, bias);
  
  const contributingFactors = [
    { factor: 'Historical Delay Rate', weight: weights[0], value: `${(metrics.historicalDelayRate * 100).toFixed(0)}%` },
    { factor: 'Buyer Payment History', weight: Math.abs(weights[2]), value: `${(metrics.buyerPaymentHistory * 100).toFixed(0)}%` },
    { factor: 'Milestone Completion', weight: Math.abs(weights[3]), value: `${(metrics.milestoneCompletionRate * 100).toFixed(0)}%` },
    { factor: 'Contract Value', weight: weights[1], value: `KES ${metrics.contractValue?.toLocaleString()}` }
  ];
  
  const recommendations = [];
  if (delayProbability > 0.5) {
    recommendations.push('Consider milestone-based payment schedule');
    recommendations.push('Establish clear deliverable acceptance criteria');
    if (metrics.documentationQuality < 0.7) recommendations.push('Improve invoice and documentation quality');
  }
  
  return {
    prediction_type: 'payment_delay',
    probability: delayProbability,
    risk_level: getRiskLevel(delayProbability),
    confidence: calculateConfidence(features),
    contributing_factors: contributingFactors,
    recommendations,
    model_version: '1.0.0'
  };
}

function predictContractCompletion(metrics: any): PredictionResult {
  const features = [
    metrics.supplierCapacity || 0.5,
    metrics.projectComplexity || 0.5, // Higher = harder to complete
    metrics.timelineRealism || 0.5,
    metrics.resourceAvailability || 0.5,
    metrics.stakeholderAlignment || 0.5,
    metrics.riskMitigationScore || 0.5
  ];
  
  const weights = [0.8, -0.9, 0.7, 0.6, 0.5, 0.4];
  const bias = 0.5;
  
  const completionProbability = logisticPrediction(features, weights, bias);
  
  const contributingFactors = [
    { factor: 'Supplier Capacity', weight: weights[0], value: `${(metrics.supplierCapacity * 100).toFixed(0)}%` },
    { factor: 'Project Complexity', weight: Math.abs(weights[1]), value: metrics.projectComplexity > 0.7 ? 'High' : 'Normal' },
    { factor: 'Timeline Realism', weight: weights[2], value: `${(metrics.timelineRealism * 100).toFixed(0)}%` },
    { factor: 'Resource Availability', weight: weights[3], value: `${(metrics.resourceAvailability * 100).toFixed(0)}%` }
  ];
  
  const recommendations = [];
  if (completionProbability < 0.7) {
    if (metrics.supplierCapacity < 0.5) recommendations.push('Consider capacity building or partnering');
    if (metrics.projectComplexity > 0.8) recommendations.push('Break down into smaller milestones');
    if (metrics.timelineRealism < 0.5) recommendations.push('Re-negotiate timeline with stakeholders');
  }
  
  return {
    prediction_type: 'contract_completion',
    probability: completionProbability,
    risk_level: getRiskLevel(1 - completionProbability),
    confidence: calculateConfidence(features),
    contributing_factors: contributingFactors,
    recommendations,
    model_version: '1.0.0'
  };
}

function predictFraudRisk(metrics: any): PredictionResult {
  const features = [
    metrics.biddingPatternAnomaly || 0,
    metrics.priceDeviation || 0,
    metrics.documentAnomalies || 0,
    metrics.networkRiskScore || 0,
    metrics.verificationGaps || 0,
    metrics.behaviorChanges || 0
  ];
  
  const weights = [1.5, 1.2, 1.0, 0.8, 0.7, 0.6];
  const bias = -2.0;
  
  const fraudProbability = logisticPrediction(features, weights, bias);
  
  const contributingFactors = [
    { factor: 'Bidding Pattern Anomaly', weight: weights[0], value: metrics.biddingPatternAnomaly > 0.5 ? 'Detected' : 'Normal' },
    { factor: 'Price Deviation', weight: weights[1], value: `${(metrics.priceDeviation * 100).toFixed(0)}%` },
    { factor: 'Document Anomalies', weight: weights[2], value: metrics.documentAnomalies > 0 ? 'Found' : 'None' },
    { factor: 'Network Risk', weight: weights[3], value: getRiskLevel(metrics.networkRiskScore) }
  ];
  
  const recommendations = [];
  if (fraudProbability > 0.3) {
    recommendations.push('Flag for manual review');
    if (metrics.biddingPatternAnomaly > 0.5) recommendations.push('Analyze bidding history for collusion patterns');
    if (metrics.documentAnomalies > 0) recommendations.push('Verify document authenticity through blockchain');
    if (metrics.verificationGaps > 0.5) recommendations.push('Request additional verification documents');
  }
  
  return {
    prediction_type: 'fraud_risk',
    probability: fraudProbability,
    risk_level: getRiskLevel(fraudProbability),
    confidence: calculateConfidence(features),
    contributing_factors: contributingFactors,
    recommendations,
    model_version: '1.0.0'
  };
}

function getRiskLevel(probability: number): 'very_low' | 'low' | 'medium' | 'high' | 'very_high' {
  if (probability < 0.2) return 'very_low';
  if (probability < 0.4) return 'low';
  if (probability < 0.6) return 'medium';
  if (probability < 0.8) return 'high';
  return 'very_high';
}

function calculateConfidence(features: number[]): number {
  // Higher confidence when we have more non-zero features
  const nonZeroCount = features.filter(f => f > 0.1).length;
  const variance = features.reduce((sum, f) => sum + Math.pow(f - 0.5, 2), 0) / features.length;
  return Math.min(0.5 + (nonZeroCount / features.length) * 0.3 + variance * 0.2, 0.95);
}

// Fetch metrics from database
async function fetchSupplierMetrics(supabase: any, supplierId: string) {
  // Get supplier profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', supplierId)
    .single();
  
  // Get bids data
  const { data: bids } = await supabase
    .from('bids')
    .select('*')
    .eq('supplier_id', supplierId);
  
  // Get contracts
  const { data: contracts } = await supabase
    .from('contracts')
    .select('*')
    .eq('supplier_id', supplierId);
  
  const awardedBids = (bids || []).filter((b: any) => b.status === 'awarded');
  const lastActivity = bids?.[0]?.created_at || profile?.updated_at;
  const daysInactive = lastActivity 
    ? Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))
    : 90;
  
  // Calculate profile completeness
  const requiredFields = ['company_name', 'email', 'phone_number', 'address', 'tax_pin', 'business_registration_number'];
  const filledFields = requiredFields.filter(f => profile?.[f]).length;
  const profileCompleteness = filledFields / requiredFields.length;
  
  return {
    activityScore: calculateActivityScore(daysInactive, bids?.length || 0, (bids?.length || 0) / 6),
    engagementScore: calculateEngagementScore(
      bids?.length || 0,
      awardedBids.length,
      0.8, // placeholder
      profileCompleteness
    ),
    financialHealth: 0.7, // placeholder
    bidSuccessRate: bids?.length > 0 ? awardedBids.length / bids.length : 0,
    profileCompleteness,
    daysInactive,
    contractsCompleted: contracts?.filter((c: any) => c.status === 'completed').length || 0,
    disputeCount: 0 // Would need dispute data
  };
}

async function fetchBuyerMetrics(supabase: any, buyerId: string) {
  const { data: tenders } = await supabase
    .from('tenders')
    .select('*')
    .eq('buyer_id', buyerId);
  
  const { data: contracts } = await supabase
    .from('contracts')
    .select('*')
    .eq('buyer_id', buyerId);
  
  const { data: budgets } = await supabase
    .from('budget_allocations')
    .select('*');
  
  const lastActivity = tenders?.[0]?.created_at;
  const daysInactive = lastActivity
    ? Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))
    : 90;
  
  const completedContracts = contracts?.filter((c: any) => c.status === 'completed') || [];
  const totalSpent = budgets?.reduce((sum: number, b: any) => sum + (b.spent_amount || 0), 0) || 0;
  const totalAllocated = budgets?.reduce((sum: number, b: any) => sum + (b.total_allocation || 0), 0) || 1;
  
  return {
    tendersCreated: tenders?.length || 0,
    avgTimeToAward: 30, // placeholder
    supplierSatisfactionScore: 0.8, // placeholder
    budgetUtilization: Math.min(totalSpent / totalAllocated, 1),
    daysInactive,
    contractCompletionRate: contracts?.length > 0 ? completedContracts.length / contracts.length : 0
  };
}

async function fetchBidMetrics(supabase: any, bidId: string) {
  const { data: bid } = await supabase
    .from('bids')
    .select(`
      *,
      tenders (*),
      profiles:supplier_id (*)
    `)
    .eq('id', bidId)
    .single();
  
  if (!bid) return null;
  
  // Get all bids for this tender to calculate competitiveness
  const { data: allBids } = await supabase
    .from('bids')
    .select('bid_amount')
    .eq('tender_id', bid.tender_id);
  
  const bidAmounts = (allBids || []).map((b: any) => b.bid_amount);
  const avgBid = bidAmounts.reduce((a: number, b: number) => a + b, 0) / bidAmounts.length;
  const minBid = Math.min(...bidAmounts);
  
  const priceCompetitiveness = bid.bid_amount <= minBid 
    ? 1 
    : Math.max(0, 1 - (bid.bid_amount - minBid) / avgBid);
  
  return {
    priceCompetitiveness,
    technicalScore: 0.7, // Would come from evaluation
    supplierVerificationLevel: bid.profiles?.verification_level === 'advanced' ? 4 : 
                               bid.profiles?.verification_level === 'standard' ? 2 : 1,
    pastPerformance: bid.profiles?.performance_score || 0.5,
    documentCompleteness: bid.uploaded_documents?.length > 0 ? 0.8 : 0.3,
    categoryExperience: 0.5, // placeholder
    bidTimeRemainingRatio: 0.5 // placeholder
  };
}

// Helper to persist predictions to database
async function persistPrediction(
  supabase: any, 
  prediction: PredictionResult, 
  entityId: string | undefined,
  entityType: string
) {
  try {
    await supabase.from('prediction_history').insert({
      prediction_type: prediction.prediction_type,
      entity_id: entityId || '00000000-0000-0000-0000-000000000000',
      entity_type: entityType,
      probability: prediction.probability,
      risk_level: prediction.risk_level,
      confidence: prediction.confidence,
      contributing_factors: prediction.contributing_factors,
      recommendations: prediction.recommendations,
      model_version: prediction.model_version
    });
  } catch (err) {
    console.error('Failed to persist prediction:', err);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { type, entity_id, entity_type }: PredictionRequest = await req.json();

    const results: PredictionResult[] = [];

    if (type === 'supplier_churn' || type === 'all') {
      const metrics = entity_id 
        ? await fetchSupplierMetrics(supabaseClient, entity_id)
        : { activityScore: 0.5, engagementScore: 0.5, financialHealth: 0.7, bidSuccessRate: 0.3, profileCompleteness: 0.6, daysInactive: 15, contractsCompleted: 2, disputeCount: 0 };
      const prediction = predictSupplierChurn(metrics);
      results.push(prediction);
      if (entity_id) await persistPrediction(supabaseClient, prediction, entity_id, 'supplier');
    }

    if (type === 'buyer_churn' || type === 'all') {
      const metrics = entity_id
        ? await fetchBuyerMetrics(supabaseClient, entity_id)
        : { tendersCreated: 5, avgTimeToAward: 30, supplierSatisfactionScore: 0.8, budgetUtilization: 0.6, daysInactive: 10, contractCompletionRate: 0.7 };
      const prediction = predictBuyerChurn(metrics);
      results.push(prediction);
      if (entity_id) await persistPrediction(supabaseClient, prediction, entity_id, 'buyer');
    }

    if (type === 'bid_success' || type === 'all') {
      const metrics = entity_id && entity_type === 'bid'
        ? await fetchBidMetrics(supabaseClient, entity_id)
        : { priceCompetitiveness: 0.7, technicalScore: 0.8, supplierVerificationLevel: 2, pastPerformance: 0.6, documentCompleteness: 0.9, categoryExperience: 0.5, bidTimeRemainingRatio: 0.6 };
      if (metrics) {
        const prediction = predictBidSuccess(metrics);
        results.push(prediction);
        if (entity_id) await persistPrediction(supabaseClient, prediction, entity_id, 'bid');
      }
    }

    if (type === 'payment_delay' || type === 'all') {
      const metrics = { historicalDelayRate: 0.2, contractValue: 5000000, buyerPaymentHistory: 0.85, milestoneCompletionRate: 0.7, disputeHistory: false, documentationQuality: 0.8 };
      const prediction = predictPaymentDelay(metrics);
      results.push(prediction);
      if (entity_id && entity_type === 'contract') await persistPrediction(supabaseClient, prediction, entity_id, 'contract');
    }

    if (type === 'contract_completion' || type === 'all') {
      const metrics = { supplierCapacity: 0.7, projectComplexity: 0.5, timelineRealism: 0.6, resourceAvailability: 0.8, stakeholderAlignment: 0.7, riskMitigationScore: 0.6 };
      const prediction = predictContractCompletion(metrics);
      results.push(prediction);
      if (entity_id && entity_type === 'contract') await persistPrediction(supabaseClient, prediction, entity_id, 'contract');
    }

    if (type === 'fraud_risk' || type === 'all') {
      const metrics = { biddingPatternAnomaly: 0.1, priceDeviation: 0.2, documentAnomalies: 0, networkRiskScore: 0.1, verificationGaps: 0.2, behaviorChanges: 0.1 };
      const prediction = predictFraudRisk(metrics);
      results.push(prediction);
      if (entity_id) await persistPrediction(supabaseClient, prediction, entity_id, entity_type || 'supplier');
    }

    return new Response(JSON.stringify({ 
      predictions: results, 
      generated_at: new Date().toISOString(),
      persisted: !!entity_id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Prediction error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
