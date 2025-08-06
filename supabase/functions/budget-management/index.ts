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

    const { action, data, budgetCode, department, financialYear } = await req.json()

    switch (action) {
      case 'create_budget':
        const { data: budget, error: budgetError } = await supabase
          .from('budget_allocations')
          .insert(data)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: budget, error: budgetError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'get_budgets':
        let query = supabase
          .from('budget_allocations')
          .select(`
            *,
            product_categories(name, code)
          `)
          .order('created_at', { ascending: false })

        if (department) {
          query = query.eq('department', department)
        }
        if (financialYear) {
          query = query.eq('financial_year', financialYear)
        }
        if (budgetCode) {
          query = query.eq('budget_code', budgetCode)
        }

        const { data: budgets, error: listError } = await query

        return new Response(JSON.stringify({ data: budgets, error: listError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'check_availability':
        const { data: budgetCheck, error: checkError } = await supabase
          .from('budget_allocations')
          .select('available_amount, committed_amount, spent_amount, total_allocation')
          .eq('budget_code', data.budget_code)
          .single()

        if (checkError) {
          return new Response(JSON.stringify({ error: 'Budget not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        const isAvailable = budgetCheck.available_amount >= data.requested_amount
        
        return new Response(JSON.stringify({ 
          data: { 
            isAvailable,
            availableAmount: budgetCheck.available_amount,
            requestedAmount: data.requested_amount,
            budgetUtilization: {
              total: budgetCheck.total_allocation,
              committed: budgetCheck.committed_amount,
              spent: budgetCheck.spent_amount,
              available: budgetCheck.available_amount
            }
          } 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'commit_budget':
        const { data: committed, error: commitError } = await supabase
          .from('budget_allocations')
          .update({ 
            committed_amount: supabase.raw('committed_amount + ?', [data.amount])
          })
          .eq('budget_code', data.budget_code)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: committed, error: commitError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'release_budget':
        const { data: released, error: releaseError } = await supabase
          .from('budget_allocations')
          .update({ 
            committed_amount: supabase.raw('committed_amount - ?', [data.amount])
          })
          .eq('budget_code', data.budget_code)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: released, error: releaseError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'spend_budget':
        const { data: spent, error: spendError } = await supabase
          .from('budget_allocations')
          .update({ 
            spent_amount: supabase.raw('spent_amount + ?', [data.amount]),
            committed_amount: supabase.raw('committed_amount - ?', [data.amount])
          })
          .eq('budget_code', data.budget_code)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: spent, error: spendError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'budget_report':
        const { data: reportData, error: reportError } = await supabase
          .from('budget_allocations')
          .select('*')
          .eq('financial_year', data.financial_year || new Date().getFullYear().toString())

        if (reportError) throw reportError

        const summary = reportData.reduce((acc, budget) => {
          acc.totalAllocated += Number(budget.total_allocation)
          acc.totalCommitted += Number(budget.committed_amount)
          acc.totalSpent += Number(budget.spent_amount)
          acc.totalAvailable += Number(budget.available_amount)
          return acc
        }, {
          totalAllocated: 0,
          totalCommitted: 0,
          totalSpent: 0,
          totalAvailable: 0
        })

        return new Response(JSON.stringify({ 
          data: { 
            budgets: reportData, 
            summary,
            utilizationRate: (summary.totalSpent / summary.totalAllocated) * 100
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
    console.error('Budget management error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})