
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS headers to allow requests from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Main function to handle requests
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, payload } = await req.json()

    // Admin client to bypass RLS for aggregate data analysis
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let data: any = {}
    let error: any = null

    switch (type) {
      case 'market-trends':
        ({ data, error } = await handleMarketTrends(supabaseAdmin));
        break
      case 'supplier-performance':
        ({ data, error } = await handleSupplierPerformance(supabaseAdmin, payload));
        break
      case 'risk-assessment':
        ({ data, error } = await handleRiskAssessment(supabaseAdmin, payload));
        break
      default:
        return new Response(JSON.stringify({ error: 'Invalid type specified' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
    }

    if (error) throw error

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return new Response(String(err?.message ?? err), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

// --- Handler Functions ---

async function handleMarketTrends(client: SupabaseClient) {
  const { data: tenders, error } = await client
    .from('tenders')
    .select('category, budget_amount')
    .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
  
  if (error) return { data: null, error }

  const trends = tenders.reduce((acc, tender) => {
    const category = tender.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = { count: 0, totalBudget: 0 }
    }
    acc[category].count++
    acc[category].totalBudget += tender.budget_amount || 0
    return acc
  }, {})

  const aggregatedData = Object.keys(trends).map(category => ({
    category,
    tenderCount: trends[category].count,
    averageBudget: trends[category].totalBudget / trends[category].count,
  }))

  return { data: { trends: aggregatedData }, error: null }
}

async function handleSupplierPerformance(client: SupabaseClient, payload: any) {
  const { supplierId } = payload
  if (!supplierId) return { data: null, error: { message: 'supplierId is required' } }

  const { data: bids, error: bidsError } = await client.from('bids').select('id').eq('supplier_id', supplierId)
  if (bidsError) return { data: null, error: bidsError }
  
  const totalBids = bids.length
  if (totalBids === 0) {
    return { data: { performance_score: 0, breakdown: { winRate: 0, avgEvaluationScore: 0, totalBids: 0, awardedBids: 0 } }, error: null }
  }

  const { data: contracts, error: contractsError } = await client.from('contracts').select('id').eq('supplier_id', supplierId)
  if (contractsError) return { data: null, error: contractsError }
  
  const awardedBidsCount = contracts.length
  const winRate = totalBids > 0 ? (awardedBidsCount / totalBids) : 0
  const winRateScore = winRate * 50

  const bidIds = bids.map(b => b.id)
  const { data: evaluations, error: evalsError } = await client.from('evaluations').select('score').in('bid_id', bidIds)
  if (evalsError) return { data: null, error: evalsError }

  let avgEvaluationScore = 0
  let avgRawScore = 0
  if (evaluations.length > 0) {
    const totalScore = evaluations.reduce((sum, e) => sum + e.score, 0)
    avgRawScore = totalScore / evaluations.length
    avgEvaluationScore = (avgRawScore / 100) * 50 // Assuming max score 100
  }

  const finalScore = Math.round(winRateScore + avgEvaluationScore)

  const { error: updateError } = await client.from('profiles').update({ performance_score: finalScore }).eq('id', supplierId)
  if (updateError) return { data: null, error: updateError }

  const responseData = {
    performance_score: finalScore,
    breakdown: { winRate, avgEvaluationScore: avgRawScore, totalBids, awardedBids: awardedBidsCount },
  }
  return { data: responseData, error: null }
}

async function handleRiskAssessment(client: SupabaseClient, payload: any) {
  const { supplierId } = payload
  if (!supplierId) return { data: null, error: { message: 'supplierId is required' } }

  const { data: profile, error: profileError } = await client.from('profiles').select('kyc_status, verification_status, risk_score').eq('id', supplierId).single()
  if (profileError) return { data: null, error: profileError }

  const { data: behavior, error: behaviorError } = await client.from('behavior_analysis').select('risk_score, analysis_type').eq('entity_id', supplierId)
  if (behaviorError) return { data: null, error: behaviorError }

  const { data: compliance, error: complianceError } = await client.from('compliance_checks').select('status').eq('user_id', supplierId).neq('status', 'verified')
  if (complianceError) return { data: null, error: complianceError }

  let calculatedRiskScore = profile.risk_score || 0
  const riskFactors = []

  if (profile.verification_status !== 'verified') {
    calculatedRiskScore += 20
    riskFactors.push({ factor: 'Verification Status', value: profile.verification_status, risk: 20 })
  }
  if (profile.kyc_status !== 'verified') { // Assuming 'verified' is the desired status
    calculatedRiskScore += 20
    riskFactors.push({ factor: 'KYC Status', value: profile.kyc_status || 'not_set', risk: 20 })
  }
  if (behavior.length > 0) {
    const behaviorRisk = behavior.reduce((sum, b) => sum + b.risk_score, 0)
    calculatedRiskScore += behaviorRisk
    riskFactors.push({ factor: 'Behavioral Analysis', value: `${behavior.length} records`, risk: behaviorRisk })
  }
  if (compliance.length > 0) {
    calculatedRiskScore += compliance.length * 10
    riskFactors.push({ factor: 'Failed Compliance Checks', value: `${compliance.length} issues`, risk: compliance.length * 10 })
  }

  const responseData = {
    risk_score: Math.min(100, Math.round(calculatedRiskScore)),
    risk_factors: riskFactors,
  }
  return { data: responseData, error: null }
}
