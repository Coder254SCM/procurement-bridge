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

    const { action, data, contractId, milestoneId } = await req.json()

    switch (action) {
      case 'create_milestone':
        const { data: milestone, error: milestoneError } = await supabase
          .from('contract_milestones')
          .insert({
            ...data,
            contract_id: contractId,
            status: 'pending'
          })
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: milestone, error: milestoneError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'get_milestones':
        const { data: milestones, error: listError } = await supabase
          .from('contract_milestones')
          .select('*')
          .eq('contract_id', contractId)
          .order('due_date', { ascending: true })

        return new Response(JSON.stringify({ data: milestones, error: listError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'update_milestone_status':
        const updateData = { status: data.status }
        if (data.status === 'completed') {
          updateData.completion_date = new Date().toISOString().split('T')[0]
        }

        const { data: updated, error: updateError } = await supabase
          .from('contract_milestones')
          .update(updateData)
          .eq('id', milestoneId)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: updated, error: updateError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'create_evaluation':
        const { data: evaluation, error: evalError } = await supabase
          .from('performance_evaluations')
          .insert({
            ...data,
            contract_id: contractId
          })
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: evaluation, error: evalError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'get_evaluations':
        const { data: evaluations, error: evalListError } = await supabase
          .from('performance_evaluations')
          .select(`
            *,
            profiles!performance_evaluations_evaluator_id_fkey(full_name)
          `)
          .eq('contract_id', contractId)
          .order('created_at', { ascending: false })

        return new Response(JSON.stringify({ data: evaluations, error: evalListError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'contract_performance_summary':
        const [milestonesResult, evaluationsResult] = await Promise.all([
          supabase
            .from('contract_milestones')
            .select('status, due_date, completion_date')
            .eq('contract_id', contractId),
          supabase
            .from('performance_evaluations')
            .select('quality_score, timeliness_score, compliance_score, overall_score')
            .eq('contract_id', contractId)
        ])

        if (milestonesResult.error) throw milestonesResult.error
        if (evaluationsResult.error) throw evaluationsResult.error

        const milestoneStats = milestonesResult.data.reduce((acc, milestone) => {
          acc.total++
          if (milestone.status === 'completed') {
            acc.completed++
            if (milestone.completion_date <= milestone.due_date) {
              acc.onTime++
            }
          } else if (milestone.status === 'overdue') {
            acc.overdue++
          }
          return acc
        }, { total: 0, completed: 0, onTime: 0, overdue: 0 })

        const avgScores = evaluationsResult.data.reduce((acc, eval, _, arr) => {
          acc.quality += Number(eval.quality_score) / arr.length
          acc.timeliness += Number(eval.timeliness_score) / arr.length
          acc.compliance += Number(eval.compliance_score) / arr.length
          acc.overall += Number(eval.overall_score) / arr.length
          return acc
        }, { quality: 0, timeliness: 0, compliance: 0, overall: 0 })

        return new Response(JSON.stringify({ 
          data: { 
            milestoneStats,
            averageScores: avgScores,
            completionRate: milestoneStats.total > 0 ? (milestoneStats.completed / milestoneStats.total) * 100 : 0,
            onTimeRate: milestoneStats.completed > 0 ? (milestoneStats.onTime / milestoneStats.completed) * 100 : 0
          } 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'check_overdue_milestones':
        const today = new Date().toISOString().split('T')[0]
        const { data: overdueMilestones, error: overdueError } = await supabase
          .from('contract_milestones')
          .update({ status: 'overdue' })
          .lt('due_date', today)
          .eq('status', 'pending')
          .select()

        return new Response(JSON.stringify({ data: overdueMilestones, error: overdueError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'milestone_progress_report':
        const { data: progressData, error: progressError } = await supabase
          .from('contract_milestones')
          .select('*')
          .eq('contract_id', contractId)

        if (progressError) throw progressError

        const progress = progressData.map(milestone => {
          const daysToDeadline = Math.ceil((new Date(milestone.due_date) - new Date()) / (1000 * 60 * 60 * 24))
          return {
            ...milestone,
            daysToDeadline,
            riskLevel: daysToDeadline < 0 ? 'overdue' : daysToDeadline < 7 ? 'high' : daysToDeadline < 30 ? 'medium' : 'low'
          }
        })

        return new Response(JSON.stringify({ data: progress }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Contract performance error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})