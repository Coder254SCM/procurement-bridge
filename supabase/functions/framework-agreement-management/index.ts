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

    const { action, data, agreementId, categoryId } = await req.json()

    switch (action) {
      case 'create_agreement':
        // Generate agreement number
        const agreementNumber = `FA-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
        
        const { data: agreement, error: agreementError } = await supabase
          .from('framework_agreements')
          .insert({
            ...data,
            agreement_number: agreementNumber,
            status: 'draft'
          })
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: agreement, error: agreementError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'get_agreements':
        let query = supabase
          .from('framework_agreements')
          .select(`
            *,
            product_categories(name, code)
          `)
          .order('created_at', { ascending: false })

        if (categoryId) {
          query = query.eq('category_id', categoryId)
        }

        const { data: agreements, error: listError } = await query

        return new Response(JSON.stringify({ data: agreements, error: listError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'publish_agreement':
        const { data: published, error: publishError } = await supabase
          .from('framework_agreements')
          .update({ status: 'published' })
          .eq('id', agreementId)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: published, error: publishError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'add_supplier':
        const currentAgreement = await supabase
          .from('framework_agreements')
          .select('suppliers')
          .eq('id', agreementId)
          .single()

        if (currentAgreement.error) throw currentAgreement.error

        const currentSuppliers = currentAgreement.data.suppliers || []
        const newSuppliers = [...currentSuppliers, {
          supplier_id: data.supplier_id,
          qualification_score: data.qualification_score,
          added_date: new Date().toISOString(),
          status: 'active'
        }]

        const { data: updated, error: updateError } = await supabase
          .from('framework_agreements')
          .update({ suppliers: newSuppliers })
          .eq('id', agreementId)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: updated, error: updateError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'remove_supplier':
        const agreementData = await supabase
          .from('framework_agreements')
          .select('suppliers')
          .eq('id', agreementId)
          .single()

        if (agreementData.error) throw agreementData.error

        const filteredSuppliers = (agreementData.data.suppliers || [])
          .filter(s => s.supplier_id !== data.supplier_id)

        const { data: removedUpdate, error: removeError } = await supabase
          .from('framework_agreements')
          .update({ suppliers: filteredSuppliers })
          .eq('id', agreementId)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: removedUpdate, error: removeError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'check_eligibility':
        const { data: eligibilityCheck, error: eligibilityError } = await supabase
          .from('framework_agreements')
          .select('suppliers, end_date, status')
          .eq('id', agreementId)
          .single()

        if (eligibilityError) throw eligibilityError

        const isActive = eligibilityCheck.status === 'active'
        const notExpired = new Date(eligibilityCheck.end_date) > new Date()
        const isQualifiedSupplier = (eligibilityCheck.suppliers || [])
          .some(s => s.supplier_id === data.supplier_id && s.status === 'active')

        return new Response(JSON.stringify({ 
          data: { 
            isEligible: isActive && notExpired && isQualifiedSupplier,
            reasons: {
              isActive,
              notExpired,
              isQualifiedSupplier
            }
          } 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'activate_agreement':
        const activationDate = new Date()
        const { data: activated, error: activateError } = await supabase
          .from('framework_agreements')
          .update({ 
            status: 'active',
            start_date: activationDate.toISOString().split('T')[0]
          })
          .eq('id', agreementId)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: activated, error: activateError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'get_active_agreements':
        const { data: activeAgreements, error: activeError } = await supabase
          .from('framework_agreements')
          .select(`
            *,
            product_categories(name, code)
          `)
          .eq('status', 'active')
          .gte('end_date', new Date().toISOString().split('T')[0])
          .order('created_at', { ascending: false })

        return new Response(JSON.stringify({ data: activeAgreements, error: activeError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Framework agreement error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})