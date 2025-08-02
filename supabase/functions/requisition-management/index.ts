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

    const { action, data } = await req.json()

    switch (action) {
      case 'create_requisition':
        // Generate requisition number
        const reqNumber = `REQ-${Date.now()}`
        const requisitionData = {
          ...data,
          requisition_number: reqNumber,
          approval_status: 'draft'
        }

        const { data: requisition, error: reqError } = await supabase
          .from('purchase_requisitions')
          .insert(requisitionData)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: requisition, error: reqError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'list_requisitions':
        const { user_id, status, department, limit = 50, offset = 0 } = data || {}
        let query = supabase
          .from('purchase_requisitions')
          .select(`
            *,
            profiles!requester_id(full_name)
          `)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1)

        if (user_id) {
          query = query.eq('requester_id', user_id)
        }
        if (status) {
          query = query.eq('approval_status', status)
        }
        if (department) {
          query = query.eq('department', department)
        }

        const { data: requisitions, error: listError } = await query
        
        return new Response(JSON.stringify({ data: requisitions, error: listError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'update_requisition':
        const { id, ...updateData } = data
        const { data: updatedReq, error: updateError } = await supabase
          .from('purchase_requisitions')
          .update(updateData)
          .eq('id', id)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: updatedReq, error: updateError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'submit_for_approval':
        const { requisition_id } = data
        
        // Get the requisition
        const { data: req, error: getReqError } = await supabase
          .from('purchase_requisitions')
          .select('*')
          .eq('id', requisition_id)
          .single()

        if (getReqError) {
          return new Response(JSON.stringify({ error: getReqError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Find applicable workflow
        const { data: workflows, error: workflowError } = await supabase
          .from('approval_workflows')
          .select('*')
          .eq('entity_type', 'requisition')
          .eq('active', true)

        if (workflowError || !workflows?.length) {
          return new Response(JSON.stringify({ error: 'No approval workflow found' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Create approval instance
        const { data: instance, error: instanceError } = await supabase
          .from('approval_instances')
          .insert({
            workflow_id: workflows[0].id,
            entity_id: requisition_id,
            entity_type: 'requisition',
            status: 'pending'
          })
          .select()
          .single()

        // Update requisition status
        const { error: statusError } = await supabase
          .from('purchase_requisitions')
          .update({ approval_status: 'submitted' })
          .eq('id', requisition_id)

        return new Response(JSON.stringify({ 
          data: { instance, submitted: !statusError }, 
          error: instanceError || statusError 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'get_requisition':
        const { requisition_id: reqId } = data
        const { data: requisitionDetail, error: detailError } = await supabase
          .from('purchase_requisitions')
          .select(`
            *,
            profiles!requester_id(full_name),
            approval_instances(
              *,
              approval_workflows(name, steps)
            )
          `)
          .eq('id', reqId)
          .single()
        
        return new Response(JSON.stringify({ data: requisitionDetail, error: detailError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Requisition management error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})