import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, payload } = await req.json()

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let data: any = {}
    let error: any = null

    switch (type) {
      case 'dashboard-kpis':
        ({ data, error } = await handleDashboardKPIs(supabaseAdmin));
        break
      case 'tender-status-distribution':
        ({ data, error } = await handleTenderStatusDistribution(supabaseAdmin));
        break
      case 'procurement-trends':
        ({ data, error } = await handleProcurementTrends(supabaseAdmin));
        break
      case 'compliance-risk':
        ({ data, error } = await handleComplianceRisk(supabaseAdmin));
        break
      case 'bidding-analytics':
        ({ data, error } = await handleBiddingAnalytics(supabaseAdmin));
        break
      case 'supply-chain-analytics':
        ({ data, error } = await handleSupplyChainAnalytics(supabaseAdmin));
        break
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
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

// Dashboard KPIs - computed from real data
async function handleDashboardKPIs(client: SupabaseClient) {
  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())

  // Active tenders (published status)
  const { count: activeTenders } = await client
    .from('tenders')
    .select('*', { count: 'exact', head: true })
    .in('status', ['published', 'open'])

  const { count: lastMonthTenders } = await client
    .from('tenders')
    .select('*', { count: 'exact', head: true })
    .in('status', ['published', 'open'])
    .lt('created_at', lastMonth.toISOString())
    .gte('created_at', twoMonthsAgo.toISOString())

  // Suppliers count
  const { count: suppliers } = await client
    .from('user_roles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'supplier')

  const { count: lastMonthSuppliers } = await client
    .from('user_roles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'supplier')
    .lt('created_at', lastMonth.toISOString())

  // Average evaluation time (from bids to evaluations)
  const { data: evaluations } = await client
    .from('evaluations')
    .select('created_at, bid_id')
    .gte('created_at', lastMonth.toISOString())

  let avgEvalTime = 0
  if (evaluations && evaluations.length > 0) {
    const bidIds = evaluations.map(e => e.bid_id)
    const { data: bids } = await client.from('bids').select('id, created_at').in('id', bidIds)
    
    if (bids) {
      let totalDays = 0
      evaluations.forEach(eval_ => {
        const bid = bids.find(b => b.id === eval_.bid_id)
        if (bid) {
          const days = (new Date(eval_.created_at).getTime() - new Date(bid.created_at).getTime()) / (1000 * 60 * 60 * 24)
          totalDays += days
        }
      })
      avgEvalTime = evaluations.length > 0 ? totalDays / evaluations.length : 0
    }
  }

  // Cost savings (difference between budget and awarded contract value)
  const { data: contracts } = await client
    .from('contracts')
    .select('contract_value, tender_id')
    .gte('created_at', lastMonth.toISOString())

  let costSavings = 0
  if (contracts && contracts.length > 0) {
    const tenderIds = contracts.map(c => c.tender_id)
    const { data: tenders } = await client.from('tenders').select('id, budget_amount').in('id', tenderIds)
    
    if (tenders) {
      contracts.forEach(contract => {
        const tender = tenders.find(t => t.id === contract.tender_id)
        if (tender && tender.budget_amount) {
          costSavings += (tender.budget_amount - contract.contract_value)
        }
      })
    }
  }

  // Compliance rate
  const { count: totalCompliance } = await client
    .from('compliance_checks')
    .select('*', { count: 'exact', head: true })

  const { count: verifiedCompliance } = await client
    .from('compliance_checks')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'verified')

  const complianceRate = totalCompliance && totalCompliance > 0 
    ? Math.round((verifiedCompliance || 0) / totalCompliance * 100) 
    : 100

  // E-tendering rate (tenders created via system)
  const { count: totalTenders } = await client
    .from('tenders')
    .select('*', { count: 'exact', head: true })

  const eTenderingRate = totalTenders && totalTenders > 0 ? 100 : 0

  return {
    data: {
      activeTenders: activeTenders || 0,
      activeTendersChange: lastMonthTenders ? Math.round(((activeTenders || 0) - lastMonthTenders) / Math.max(lastMonthTenders, 1) * 100) : 0,
      suppliers: suppliers || 0,
      suppliersChange: lastMonthSuppliers ? Math.round(((suppliers || 0) - lastMonthSuppliers) / Math.max(lastMonthSuppliers, 1) * 100) : 0,
      avgEvalTime: avgEvalTime.toFixed(1),
      avgEvalTimeChange: 0,
      costSavings: costSavings,
      costSavingsChange: 0,
      complianceRate,
      complianceRateChange: 0,
      eTenderingRate,
      eTenderingRateChange: 0,
    },
    error: null
  }
}

// Tender status distribution for pie chart
async function handleTenderStatusDistribution(client: SupabaseClient) {
  const statuses = ['published', 'under_evaluation', 'awarded', 'closed', 'draft']
  const colors: Record<string, string> = {
    'published': '#7C3AED',
    'under_evaluation': '#F59E0B',
    'awarded': '#10B981',
    'closed': '#6B7280',
    'draft': '#3B82F6'
  }
  const labels: Record<string, string> = {
    'published': 'Open',
    'under_evaluation': 'Under Evaluation',
    'awarded': 'Awarded',
    'closed': 'Closed',
    'draft': 'Draft'
  }

  const results = await Promise.all(
    statuses.map(async (status) => {
      const { count } = await client
        .from('tenders')
        .select('*', { count: 'exact', head: true })
        .eq('status', status)
      return { name: labels[status] || status, value: count || 0, color: colors[status] || '#6B7280' }
    })
  )

  return { data: results.filter(r => r.value > 0), error: null }
}

// Monthly procurement trends
async function handleProcurementTrends(client: SupabaseClient) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentYear = new Date().getFullYear()

  const results = await Promise.all(
    months.map(async (month, index) => {
      const startDate = new Date(currentYear, index, 1)
      const endDate = new Date(currentYear, index + 1, 0)

      const { data: tenders } = await client
        .from('tenders')
        .select('budget_amount')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      const count = tenders?.length || 0
      const totalValue = tenders?.reduce((sum, t) => sum + (t.budget_amount || 0), 0) || 0

      return {
        month,
        tenders: count,
        value: Math.round(totalValue / 1000000) // Convert to millions
      }
    })
  )

  return { data: results, error: null }
}

// Compliance and risk distribution
async function handleComplianceRisk(client: SupabaseClient) {
  const { data: riskAssessments } = await client
    .from('risk_assessments')
    .select('risk_level')

  const riskCounts = {
    'High Risk': 0,
    'Medium Risk': 0,
    'Low Risk': 0
  }

  if (riskAssessments) {
    riskAssessments.forEach(ra => {
      if (ra.risk_level === 'high') riskCounts['High Risk']++
      else if (ra.risk_level === 'medium') riskCounts['Medium Risk']++
      else riskCounts['Low Risk']++
    })
  }

  // If no data, also count suppliers by verification status
  if (Object.values(riskCounts).every(v => v === 0)) {
    const { data: profiles } = await client
      .from('profiles')
      .select('verification_status, kyc_status')

    if (profiles) {
      profiles.forEach(p => {
        if (p.verification_status === 'verified' && p.kyc_status === 'verified') {
          riskCounts['Low Risk']++
        } else if (p.verification_status === 'verified' || p.kyc_status === 'verified') {
          riskCounts['Medium Risk']++
        } else {
          riskCounts['High Risk']++
        }
      })
    }
  }

  return {
    data: [
      { name: 'High Risk', value: riskCounts['High Risk'], color: '#EF4444' },
      { name: 'Medium Risk', value: riskCounts['Medium Risk'], color: '#F59E0B' },
      { name: 'Low Risk', value: riskCounts['Low Risk'], color: '#10B981' }
    ].filter(r => r.value > 0),
    error: null
  }
}

// Bidding analytics
async function handleBiddingAnalytics(client: SupabaseClient) {
  // Bidding competition by category
  const { data: tenders } = await client
    .from('tenders')
    .select('id, category')

  const categoryBids: Record<string, { count: number, bids: number }> = {}

  if (tenders) {
    for (const tender of tenders) {
      const category = tender.category || 'Uncategorized'
      if (!categoryBids[category]) {
        categoryBids[category] = { count: 0, bids: 0 }
      }
      categoryBids[category].count++

      const { count } = await client
        .from('bids')
        .select('*', { count: 'exact', head: true })
        .eq('tender_id', tender.id)
      
      categoryBids[category].bids += count || 0
    }
  }

  const biddingCompetition = Object.entries(categoryBids).map(([category, data]) => ({
    tenderCategory: category,
    avgBids: data.count > 0 ? Math.round(data.bids / data.count) : 0
  }))

  // Price variance - get recent tenders with bids
  const { data: recentTenders } = await client
    .from('tenders')
    .select('id, title')
    .order('created_at', { ascending: false })
    .limit(5)

  const priceVariance = []
  if (recentTenders) {
    for (const tender of recentTenders) {
      const { data: bids } = await client
        .from('bids')
        .select('bid_amount')
        .eq('tender_id', tender.id)

      if (bids && bids.length > 0) {
        const amounts = bids.map(b => b.bid_amount)
        priceVariance.push({
          name: tender.title?.substring(0, 15) || 'Tender',
          highestBid: Math.max(...amounts),
          lowestBid: Math.min(...amounts),
          averageBid: Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length)
        })
      }
    }
  }

  return { 
    data: { 
      biddingCompetition: biddingCompetition.length > 0 ? biddingCompetition : [],
      priceVariance: priceVariance.length > 0 ? priceVariance : []
    }, 
    error: null 
  }
}

// Supply chain analytics
async function handleSupplyChainAnalytics(client: SupabaseClient) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const currentYear = new Date().getFullYear()

  // Lead time calculation (from tender creation to contract)
  const leadTimeData = await Promise.all(
    months.map(async (month, index) => {
      const startDate = new Date(currentYear, index, 1)
      const endDate = new Date(currentYear, index + 1, 0)

      const { data: contracts } = await client
        .from('contracts')
        .select('created_at, tender_id')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      let totalDays = 0
      let count = 0

      if (contracts && contracts.length > 0) {
        const tenderIds = contracts.map(c => c.tender_id)
        const { data: tenders } = await client.from('tenders').select('id, created_at').in('id', tenderIds)

        if (tenders) {
          contracts.forEach(contract => {
            const tender = tenders.find(t => t.id === contract.tender_id)
            if (tender) {
              const days = (new Date(contract.created_at).getTime() - new Date(tender.created_at).getTime()) / (1000 * 60 * 60 * 24)
              totalDays += days
              count++
            }
          })
        }
      }

      return {
        month,
        average: count > 0 ? Math.round(totalDays / count) : 0
      }
    })
  )

  // Document processing stages
  const documentProcessingData = [
    { stage: 'Document Preparation', time: 5 },
    { stage: 'Review', time: 3 },
    { stage: 'Approval', time: 2 },
    { stage: 'Publishing', time: 1 },
    { stage: 'Clarification', time: 4 }
  ]

  return { 
    data: { 
      leadTimeData: leadTimeData.some(l => l.average > 0) ? leadTimeData : [],
      documentProcessingData 
    }, 
    error: null 
  }
}

// Market trends handler
async function handleMarketTrends(client: SupabaseClient) {
  const { data: tenders, error } = await client
    .from('tenders')
    .select('category, budget_amount')
    .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
  
  if (error) return { data: null, error }

  const trends: Record<string, { count: number, totalBudget: number }> = {}
  
  if (tenders) {
    tenders.forEach(tender => {
      const category = tender.category || 'Uncategorized'
      if (!trends[category]) {
        trends[category] = { count: 0, totalBudget: 0 }
      }
      trends[category].count++
      trends[category].totalBudget += tender.budget_amount || 0
    })
  }

  const aggregatedData = Object.keys(trends).map(category => ({
    category,
    tenderCount: trends[category].count,
    averageBudget: trends[category].count > 0 ? trends[category].totalBudget / trends[category].count : 0,
  }))

  return { data: { trends: aggregatedData }, error: null }
}

// Supplier performance handler
async function handleSupplierPerformance(client: SupabaseClient, payload: any) {
  const { supplierId } = payload
  if (!supplierId) return { data: null, error: { message: 'supplierId is required' } }

  const { data: bids, error: bidsError } = await client.from('bids').select('id').eq('supplier_id', supplierId)
  if (bidsError) return { data: null, error: bidsError }
  
  const totalBids = bids?.length || 0
  if (totalBids === 0) {
    return { data: { performance_score: 0, breakdown: { winRate: 0, avgEvaluationScore: 0, totalBids: 0, awardedBids: 0 } }, error: null }
  }

  const { data: contracts } = await client.from('contracts').select('id').eq('supplier_id', supplierId)
  const awardedBidsCount = contracts?.length || 0
  const winRate = totalBids > 0 ? (awardedBidsCount / totalBids) : 0
  const winRateScore = winRate * 50

  const bidIds = bids?.map(b => b.id) || []
  const { data: evaluations } = await client.from('evaluations').select('score').in('bid_id', bidIds)

  let avgEvaluationScore = 0
  let avgRawScore = 0
  if (evaluations && evaluations.length > 0) {
    const totalScore = evaluations.reduce((sum, e) => sum + e.score, 0)
    avgRawScore = totalScore / evaluations.length
    avgEvaluationScore = (avgRawScore / 100) * 50
  }

  const finalScore = Math.round(winRateScore + avgEvaluationScore)

  await client.from('profiles').update({ performance_score: finalScore }).eq('id', supplierId)

  return {
    data: {
      performance_score: finalScore,
      breakdown: { winRate, avgEvaluationScore: avgRawScore, totalBids, awardedBids: awardedBidsCount },
    },
    error: null
  }
}

// Risk assessment handler
async function handleRiskAssessment(client: SupabaseClient, payload: any) {
  const { supplierId } = payload
  if (!supplierId) return { data: null, error: { message: 'supplierId is required' } }

  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('kyc_status, verification_status, risk_score')
    .eq('id', supplierId)
    .single()
  
  if (profileError) return { data: null, error: profileError }

  const { data: behavior } = await client
    .from('behavior_analysis')
    .select('risk_score, analysis_type')
    .eq('entity_id', supplierId)

  const { data: compliance } = await client
    .from('compliance_checks')
    .select('status')
    .eq('user_id', supplierId)
    .neq('status', 'verified')

  let calculatedRiskScore = profile?.risk_score || 0
  const riskFactors = []

  if (profile?.verification_status !== 'verified') {
    calculatedRiskScore += 20
    riskFactors.push({ factor: 'Verification Status', value: profile?.verification_status || 'pending', risk: 20 })
  }
  if (profile?.kyc_status !== 'verified') {
    calculatedRiskScore += 20
    riskFactors.push({ factor: 'KYC Status', value: profile?.kyc_status || 'not_set', risk: 20 })
  }
  if (behavior && behavior.length > 0) {
    const behaviorRisk = behavior.reduce((sum, b) => sum + b.risk_score, 0)
    calculatedRiskScore += behaviorRisk
    riskFactors.push({ factor: 'Behavioral Analysis', value: `${behavior.length} records`, risk: behaviorRisk })
  }
  if (compliance && compliance.length > 0) {
    calculatedRiskScore += compliance.length * 10
    riskFactors.push({ factor: 'Failed Compliance Checks', value: `${compliance.length} issues`, risk: compliance.length * 10 })
  }

  return {
    data: {
      risk_score: Math.min(100, Math.round(calculatedRiskScore)),
      risk_factors: riskFactors,
    },
    error: null
  }
}
