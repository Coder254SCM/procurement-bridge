import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, data, supplierId, categoryId } = await req.json()

    switch (action) {
      case 'submit_qualification':
        const { data: qualification, error: qualError } = await supabase
          .from('supplier_qualifications')
          .insert({
            ...data,
            supplier_id: supplierId,
            category_id: categoryId,
            status: 'pending'
          })
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: qualification, error: qualError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'update_qualification':
        const { id, ...updateData } = data
        const { data: updated, error: updateError } = await supabase
          .from('supplier_qualifications')
          .update(updateData)
          .eq('id', id)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: updated, error: updateError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'get_qualifications':
        let query = supabase
          .from('supplier_qualifications')
          .select(`
            *,
            product_categories(name, code),
            profiles(full_name, company_name)
          `)
          .order('created_at', { ascending: false })

        if (supplierId) {
          query = query.eq('supplier_id', supplierId)
        }
        if (categoryId) {
          query = query.eq('category_id', categoryId)
        }

        const { data: qualifications, error: listError } = await query

        return new Response(JSON.stringify({ data: qualifications, error: listError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'approve_qualification':
        const { data: approved, error: approveError } = await supabase
          .from('supplier_qualifications')
          .update({ 
            status: 'approved',
            valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
          })
          .eq('id', data.id)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: approved, error: approveError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'calculate_score':
        const qualificationData = data
        let totalScore = 0
        let scoreBreakdown = {}

        // Financial capacity scoring (40%)
        if (qualificationData.financial_capacity) {
          const financialScore = Math.min(qualificationData.financial_capacity / 10000000, 1) * 40
          scoreBreakdown.financial = financialScore
          totalScore += financialScore
        }

        // Technical capacity scoring (30%)
        if (qualificationData.technical_capacity) {
          const techCapabilities = Object.keys(qualificationData.technical_capacity).length
          const techScore = Math.min(techCapabilities / 10, 1) * 30
          scoreBreakdown.technical = techScore
          totalScore += techScore
        }

        // Compliance scoring (30%)
        if (qualificationData.certification_documents) {
          const certCount = qualificationData.certification_documents.length
          const complianceScore = Math.min(certCount / 5, 1) * 30
          scoreBreakdown.compliance = complianceScore
          totalScore += complianceScore
        }

        return new Response(JSON.stringify({ 
          data: { 
            totalScore: Math.round(totalScore * 100) / 100,
            scoreBreakdown 
          } 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Supplier qualification error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})